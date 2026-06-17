import { db } from '@/db'
import { base } from '@/db/util'
import type { DeclarationAnswers, HealthDeclaration, HealthScore } from '@/db/types'
import { TWO_YEARS_MS } from '@/lib/date'

export async function latestHealthScore(): Promise<HealthScore | undefined> {
  const arr = await db.healthScores.orderBy('computedAt').reverse().limit(1).toArray()
  return arr[0]
}

export async function allHealthScores(): Promise<HealthScore[]> {
  return db.healthScores.orderBy('computedAt').toArray()
}

export async function getDeclaration(userId: string): Promise<HealthDeclaration | undefined> {
  return db.healthDeclarations.where('userId').equals(userId).last()
}

function anyYes(answers: DeclarationAnswers): boolean {
  return Object.values(answers).some(Boolean)
}

export async function submitDeclaration(
  userId: string,
  answers: DeclarationAnswers,
  signedName: string,
  certificateFileName?: string,
): Promise<HealthDeclaration> {
  const submittedAt = Date.now()
  const requiresCertificate = anyYes(answers)
  const status: HealthDeclaration['status'] = requiresCertificate
    ? certificateFileName
      ? 'approved'
      : 'pending_certificate'
    : 'approved'

  const declaration: HealthDeclaration = {
    ...base(),
    userId,
    answers,
    signedName,
    certificateFileName,
    submittedAt,
    expiresAt: submittedAt + TWO_YEARS_MS,
    status,
  }
  await db.healthDeclarations.put(declaration)
  return declaration
}

export async function attachCertificate(declarationId: string, fileName: string): Promise<void> {
  await db.healthDeclarations.update(declarationId, {
    certificateFileName: fileName,
    status: 'approved',
    updatedAt: Date.now(),
  })
}
