import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../globalContext'
import Button from '../../components/Button'

export default function PendingVerificationPage() {
  const { logout } = useGlobalContext()
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setTimeout(() => {
      setUploadedDocs(prev => [...prev, file.name])
      setUploading(false)
      e.target.value = ''
    }, 800)
  }

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

   return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-container-lowest rounded-3xl shadow-xl border border-outline-variant/30 p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-amber-600" style={{ fontVariationSettings: "'FILL' 1" }}>
              pending
            </span>
          </div>
          <h1 className="font-jakarta text-2xl font-bold text-on-surface mb-2">Verification Pending</h1>
          <p className="font-lexend text-on-surface-variant text-sm">
            Your account registration is complete. Your employer profile is awaiting admin approval.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-amber-600 text-xl flex-shrink-0 mt-0.5">
              info
            </span>
            <div>
              <p className="text-sm font-jakarta font-semibold text-amber-800">What happens next?</p>
              <p className="text-xs font-lexend text-amber-700 mt-1">
                An administrator will review your company profile and documents. You'll receive a notification once approved.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="font-jakarta text-sm font-semibold text-on-surface mb-3 block">
            Upload Additional Documents
          </label>
          <div className="border-2 border-dashed border-outline-variant/30 rounded-xl p-6 text-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleFileUpload}
              className="hidden"
              id="doc-upload"
            />
            <label htmlFor="doc-upload" className="cursor-pointer">
              <span className="material-symbols-outlined text-3xl text-outline mb-2">upload_file</span>
              <p className="font-lexend text-sm text-on-surface-variant">
                {uploading ? 'Uploading...' : 'Click to upload documents'}
              </p>
              <p className="font-lexend text-xs text-outline mt-1">PDF, DOC, JPG, PNG (max 5MB)</p>
            </label>
          </div>
        </div>

        {uploadedDocs.length > 0 && (
          <div className="mb-6">
            <p className="font-jakarta text-sm font-semibold text-on-surface mb-2">Uploaded Documents:</p>
            <div className="space-y-2">
              {uploadedDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-3">
                  <span className="material-symbols-outlined text-outline text-xl">picture_as_pdf</span>
                  <span className="font-lexend text-sm text-on-surface">{doc}</span>
                  <span className="ml-auto text-xs font-jakarta font-semibold text-secondary">Uploaded</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-center gap-2 border-primary/30 text-primary hover:bg-primary/5"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Log Out
          </Button>
          <p className="text-xs font-lexend text-outline text-center">
            Need help? Contact <span className="text-primary font-semibold">support@polaris.edu.eg</span>
          </p>
        </div>
      </div>
    </div>
  )
}
