import jsPDF from "jspdf"
import { getEmpresaData } from "../components/Configuracoes"
import logoImg from "../assets/icone_1.png"

export function gerarCertificadoPDF({ fields, clienteNome, equipamentoNome }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const empresa = getEmpresaData()

  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 20

  // Header vermelho
  doc.setFillColor(220, 38, 38)
  doc.rect(0, 0, pageW, 36, "F")

  // Logo
  try {
    doc.addImage(logoImg, "PNG", 0, -7.5, 42, 42)
  } catch {}

  // Nome do app
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("EXTINFOCO", 38, 14)

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text("Gestão de Extintores e Segurança", 38, 20)

  // Dados da empresa
  doc.setFontSize(8)
  const companyLines = []

  if (empresa.nome) companyLines.push(empresa.nome)
  if (empresa.cnpj) companyLines.push(`CNPJ: ${empresa.cnpj}`)
  if (empresa.endereco) companyLines.push(empresa.endereco)

  if (empresa.cidade || empresa.estado) {
    companyLines.push(
      [empresa.cidade, empresa.estado].filter(Boolean).join(" - ")
    )
  }

  if (empresa.telefone) companyLines.push(`Tel: ${empresa.telefone}`)
  if (empresa.email) companyLines.push(empresa.email)

  let compY = 8

  for (const line of companyLines) {
    doc.text(line, pageW - margin, compY, { align: "right" })
    compY += 4.5
  }

  // Título
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("CERTIFICADO DE SERVIÇO", pageW / 2, 46, { align: "center" })

  // Número
  const numCert = fields["Número do Certificado"] || "-"
  doc.setFontSize(11)
  doc.text(`Nº: ${numCert}`, pageW / 2, 53, { align: "center" })

  // Linha
  doc.setDrawColor(220, 38, 38)
  doc.setLineWidth(0.5)
  doc.line(margin, 57, pageW - margin, 57)

  // Dados
  const rows = [
    ["Cliente", clienteNome || "-"],
    ["Equipamento", equipamentoNome || "-"],
    ["Tipo de Serviço", fields["Tipo de Serviço"] || "-"],
    ["Data de Emissão", formatDateBR(fields["Data de Emissão"])],
    ["Data de Validade", formatDateBR(fields["Data de Validade"])]
  ]

  let y = 67

  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold")
    doc.setTextColor(80, 80, 80)
    doc.text(`${label}:`, margin, y)

    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    doc.text(String(value), margin + 50, y)

    y += 10
  })

  // Observações
  if (fields["Observações"]) {
    y += 4
    doc.setFont("helvetica", "bold")
    doc.setTextColor(80, 80, 80)
    doc.text("Observações:", margin, y)
    y += 7

    doc.setFont("helvetica", "normal")
    const lines = doc.splitTextToSize(
      fields["Observações"],
      pageW - margin * 2
    )
    doc.text(lines, margin, y)
    y += lines.length * 6
  }

  // Assinaturas
  y = Math.max(y + 20, 210)

  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.3)

  doc.line(margin, y, margin + 70, y)
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text("Assinatura do Responsável", margin, y + 5)

  doc.line(pageW - margin - 70, y, pageW - margin, y)
  doc.text("Assinatura do Cliente", pageW - margin - 70, y + 5)

  // Footer
  doc.setFillColor(240, 240, 240)
  doc.rect(0, pageH - 14, pageW, 14, "F")

  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)

  doc.text(
    `Emitido em ${new Date().toLocaleDateString("pt-BR")} — EXTINFOCO`,
    pageW / 2,
    pageH - 5,
    { align: "center" }
  )

  const filename = `certificado_${String(numCert).replace(
    /[^a-zA-Z0-9]/g,
    "_"
  )}.pdf`

  doc.save(filename)
}

function formatDateBR(dateStr) {
  if (!dateStr) return "-"

  const parts = String(dateStr).split("-")
  if (parts.length !== 3) return dateStr

  const [year, month, day] = parts
  return `${day}/${month}/${year}`
}
