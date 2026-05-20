import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateDatabase } from '../../../../../store/databaseSlice'
import type { RootState } from '../../../../../store'
import type { CompanyProfile } from '../../../../../types'

export interface EmployerApplication {
  id: string
  companyName: string
  email: string
  appliedDate: string
  status: 'Pending' | 'Approved' | 'Rejected'
  bio: string
  address: string
  documentUrl: string
  documents?: Array<{ id: string; name: string; type: string; size: number; uploadedAt: string }>
  phone?: string
  logoUrl?: string
}

export function useEmployerApplications() {
  const dispatch = useDispatch()
  const companies = useSelector((state: RootState) => state.database.companies)

  const applications: EmployerApplication[] = useMemo(() => {
    return companies.map((c: CompanyProfile) => ({
      id: c.contactEmail,
      companyName: c.companyName,
      email: c.contactEmail,
      appliedDate: c.documents?.[0]?.uploadedAt?.split('T')[0] || 'Unknown',
      status: c.approvalStatus as 'Pending' | 'Approved' | 'Rejected',
      bio: c.biography,
      address: c.address,
      documentUrl: c.documents?.[0]?.name || '',
      logoUrl: c.logoUrl || '',
      documents: c.documents,
      phone: c.phone
    }))
  }, [companies])

  const acceptApplication = (email: string) => {
    const company = companies.find((c: CompanyProfile) => c.contactEmail === email)
    if (company) {
      dispatch(updateDatabase({
        companies: companies.map((c: CompanyProfile) =>
          c.contactEmail === email ? { ...c, approvalStatus: 'Approved' as const } : c
        )
      }))
    }
  }

  const rejectApplication = (email: string) => {
    const company = companies.find((c: CompanyProfile) => c.contactEmail === email)
    if (company) {
      dispatch(updateDatabase({
        companies: companies.map((c: CompanyProfile) =>
          c.contactEmail === email ? { ...c, approvalStatus: 'Rejected' as const } : c
        )
      }))
    }
  }

  const downloadDocument = (url: string, filename: string) => {
    if (!url) {
      alert('No document available to download.')
      return
    }
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return {
    applications,
    acceptApplication,
    rejectApplication,
    downloadDocument
  }
}
