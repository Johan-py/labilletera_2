import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Html5Qrcode } from 'html5-qrcode'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import type { QrMyInfo, QrPaymentStatus } from '../types'

type Tab = 'cobrar' | 'pagar'

export default function QrPayment() {
  const { setWallet } = useAuth()
  const [tab, setTab] = useState<Tab>('cobrar')

  return (
    <div className="space-y-4">
      <div className="flex bg-white rounded-xl p-1 shadow-sm border border-borde/50">
        {(['cobrar', 'pagar'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-marino text-white shadow'
                : 'text-texto-muted hover:text-texto-oscuro'
            }`}
          >
            {t === 'cobrar' ? '📷 Cobrar' : '📱 Pagar'}
          </button>
        ))}
      </div>

      {tab === 'cobrar' ? <CobrarTab /> : <PagarTab setWallet={setWallet} />}
    </div>
  )
}

function CobrarTab() {
  const { user } = useAuth()
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [paymentInfo, setPaymentInfo] = useState<QrMyInfo | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    api.getQrMyInfo()
      .then(setPaymentInfo)
      .catch(() => {})
  }, [])

  const handleGenerate = async () => {
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) return
    setGenerating(true)
    setError('')
    try {
      const res = await api.generateQrPayment({
        amount: amt,
        description: description || undefined,
      })

      const canvas = canvasRef.current
      if (canvas) {
        await QRCode.toCanvas(canvas, res.id, {
          width: 220,
          margin: 2,
          color: { dark: '#1B2B4B', light: '#ffffff' },
        })
      }
      setQrCode(res.id)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (qrCode) {
      try {
        await navigator.clipboard.writeText(qrCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {}
    }
  }

  const remainingTime = qrCode ? '5 min' : null

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-borde/50">
        <p className="text-xs text-texto-muted uppercase tracking-wider mb-1">Tu información</p>
        <p className="font-semibold text-texto-oscuro">{paymentInfo?.full_name || user?.full_name}</p>
        <p className="text-sm text-texto-muted">
          Balance: Bs {(paymentInfo?.balance ?? 0).toLocaleString('es-CL', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-borde/50 space-y-3">
        <div>
          <label className="block text-xs font-medium text-texto-muted mb-1">Monto a cobrar</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-texto-muted font-medium">Bs</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-xl bg-off-white border border-borde text-texto-oscuro focus:outline-none focus:ring-2 focus:ring-azul-card focus:border-transparent"
              placeholder="0.00"
              disabled={!!qrCode}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-texto-muted mb-1">Concepto (opcional)</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-off-white border border-borde text-texto-oscuro focus:outline-none focus:ring-2 focus:ring-azul-card focus:border-transparent"
            placeholder="Ej: Cena, regalo..."
            disabled={!!qrCode}
          />
        </div>

        {!qrCode ? (
          <button
            onClick={handleGenerate}
            disabled={generating || !amount || parseFloat(amount) <= 0}
            className="w-full py-3 rounded-xl bg-marino text-white font-semibold text-sm hover:bg-azul-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generando...' : 'Generar Código QR'}
          </button>
        ) : (
          <button
            onClick={() => {
              setQrCode(null)
              setAmount('')
              setDescription('')
            }}
            className="w-full py-2.5 rounded-xl bg-borde/50 text-texto-muted font-medium text-sm hover:bg-borde transition-colors"
          >
            Generar otro QR
          </button>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg text-center">
            {error}
          </div>
        )}
      </div>

      <div className={`bg-white rounded-xl p-6 shadow-sm border border-borde/50 flex flex-col items-center space-y-3 ${qrCode ? '' : 'hidden'}`}>
        <canvas ref={canvasRef} className="rounded-lg" />
        <p className="text-sm font-semibold text-texto-oscuro">
          Bs {parseFloat(amount).toLocaleString('es-CL', { minimumFractionDigits: 2 })}
        </p>
        {description && (
          <p className="text-xs text-texto-muted">{description}</p>
        )}
        <p className="text-xs text-ambar font-medium">
          ⏱ Vence en {remainingTime}
        </p>
        <p className="text-xs text-texto-muted text-center">
          Muestra este código QR a quien quieras cobrarle
        </p>
        <button
          onClick={handleCopy}
          className="text-xs text-verde hover:text-verde/80 font-medium"
        >
          {copied ? '✓ ID copiado' : 'Copiar ID del pago'}
        </button>
      </div>
    </div>
  )
}

function PagarTab({ setWallet }: { setWallet: (w: any) => void }) {
  const [scanning, setScanning] = useState(false)
  const [scannedId, setScannedId] = useState<string | null>(null)
  const [paymentDetails, setPaymentDetails] = useState<QrPaymentStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [manualId, setManualId] = useState('')
  const [showManual, setShowManual] = useState(false)
  const [error, setError] = useState('')
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerContainerId = 'qr-scanner'

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const startScanner = async () => {
    setScanning(true)
    setError('')
    try {
      const scanner = new Html5Qrcode(scannerContainerId)
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        () => {},
      )
    } catch (err: any) {
      setError('No se pudo acceder a la cámara: ' + (err.message || 'Permiso denegado'))
      setScanning(false)
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
      } catch {}
      scannerRef.current = null
    }
    setScanning(false)
  }

  const onScanSuccess = (decodedText: string) => {
    stopScanner()
    setScannedId(decodedText.trim())
    loadPaymentDetails(decodedText.trim())
  }

  const loadPaymentDetails = async (id: string) => {
    setLoading(true)
    setError('')
    try {
      const details = await api.getQrPaymentStatus(id)
      setPaymentDetails(details)
    } catch (err: any) {
      setError(err.message || 'Error al obtener datos del pago')
      setScannedId(null)
    } finally {
      setLoading(false)
    }
  }

  const handleManualLookup = () => {
    const id = manualId.trim()
    if (!id) return
    setScannedId(id)
    loadPaymentDetails(id)
  }

  const handlePay = async () => {
    if (!scannedId) return
    setPaying(true)
    setError('')
    try {
      const res = await api.payQrPayment(scannedId)
      setResult({
        success: true,
        message: `Pago exitoso de Bs ${res.transaction.amount.toLocaleString('es-CL', { minimumFractionDigits: 2 })} a ${res.to_user}`,
      })
      setWallet({ balance: res.new_balance } as any)
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago')
    } finally {
      setPaying(false)
    }
  }

  const handleReset = () => {
    setScannedId(null)
    setPaymentDetails(null)
    setResult(null)
    setError('')
    setManualId('')
  }

  return (
    <div className="space-y-4">
      {result ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-borde/50 text-center space-y-4">
          <div className="w-16 h-16 bg-exito-suave rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-verde" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-semibold text-texto-oscuro">{result.message}</p>
          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl bg-marino text-white font-semibold text-sm hover:bg-azul-card transition-colors"
          >
            Escanear otro QR
          </button>
        </div>
      ) : !scannedId ? (
        <>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-borde/50 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-texto-muted uppercase tracking-wider font-medium">
                Escanear código QR
              </p>
              <button
                onClick={() => setShowManual(!showManual)}
                className="text-xs text-verde font-medium"
              >
                {showManual ? 'Usar cámara' : 'Ingresar ID manual'}
              </button>
            </div>

            {showManual ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={manualId}
                  onChange={e => setManualId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-off-white border border-borde text-texto-oscuro focus:outline-none focus:ring-2 focus:ring-azul-card focus:border-transparent"
                  placeholder="Pega el ID del QR aquí"
                />
                <button
                  onClick={handleManualLookup}
                  disabled={!manualId.trim()}
                  className="w-full py-3 rounded-xl bg-marino text-white font-semibold text-sm hover:bg-azul-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buscar pago
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  id={scannerContainerId}
                  className="w-full aspect-square bg-marino rounded-xl overflow-hidden"
                />

                {!scanning ? (
                  <button
                    onClick={startScanner}
                    className="w-full py-3 rounded-xl bg-marino text-white font-semibold text-sm hover:bg-azul-card transition-colors"
                  >
                    Activar Cámara
                  </button>
                ) : (
                  <button
                    onClick={stopScanner}
                    className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
                  >
                    Detener Cámara
                  </button>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg text-center">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-8 text-texto-muted text-sm">
              Obteniendo datos del pago...
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-borde/50 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-texto-muted text-sm">
              Cargando...
            </div>
          ) : paymentDetails ? (
            <>
              <h3 className="font-bold text-texto-oscuro text-lg">Detalle del pago</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-borde/50">
                  <span className="text-sm text-texto-muted">Cobrador</span>
                  <span className="text-sm font-semibold text-texto-oscuro">{paymentDetails.to_user_name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-borde/50">
                  <span className="text-sm text-texto-muted">Monto</span>
                  <span className="text-sm font-semibold text-verde">
                    Bs {paymentDetails.amount.toLocaleString('es-CL', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {paymentDetails.description && (
                  <div className="flex justify-between py-2 border-b border-borde/50">
                    <span className="text-sm text-texto-muted">Concepto</span>
                    <span className="text-sm text-texto-oscuro">{paymentDetails.description}</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-sm text-texto-muted">Vence</span>
                  <span className="text-sm text-ambar font-medium">
                    {new Date(paymentDetails.expires_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg text-center">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl bg-borde/50 text-texto-muted font-medium text-sm hover:bg-borde transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="flex-1 py-3 rounded-xl bg-marino text-white font-semibold text-sm hover:bg-azul-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paying ? 'Procesando...' : 'Confirmar Pago'}
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}
