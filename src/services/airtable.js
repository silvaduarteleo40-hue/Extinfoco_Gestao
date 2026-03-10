import axios from 'axios'

const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID

const airtable = axios.create({
  baseURL: `https://api.airtable.com/v0/${BASE_ID}`,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
})

async function getRecords(tableName, params = {}) {
  const response = await airtable.get(`/${encodeURIComponent(tableName)}`, { params })
  return response.data.records
}

async function getRecordById(tableName, recordId) {
  const response = await airtable.get(`/${encodeURIComponent(tableName)}/${recordId}`)
  return response.data
}

async function createRecord(tableName, fields) {
  const response = await airtable.post(`/${encodeURIComponent(tableName)}`, {
    fields
  })
  return response.data
}

async function updateRecord(tableName, recordId, fields) {
  const response = await airtable.patch(`/${encodeURIComponent(tableName)}/${recordId}`, {
    fields
  })
  return response.data
}

async function deleteRecord(tableName, recordId) {
  const response = await airtable.delete(`/${encodeURIComponent(tableName)}/${recordId}`)
  return response.data
}

export const clientesAPI = {
  getAll: () => getRecords('Clientes'),
  getById: (id) => getRecordById('Clientes', id),
  create: (fields) => createRecord('Clientes', fields),
  update: (id, fields) => updateRecord('Clientes', id, fields),
  remove: (id) => deleteRecord('Clientes', id)
}

export const equipamentosAPI = {
  getAll: () => getRecords('Equipamentos'),
  getById: (id) => getRecordById('Equipamentos', id),
  create: (fields) => createRecord('Equipamentos', fields),
  update: (id, fields) => updateRecord('Equipamentos', id, fields),
  remove: (id) => deleteRecord('Equipamentos', id),
  getUrgentes: () =>
    getRecords('Equipamentos', {
      filterByFormula:
        "OR(FIND('Vencido', {Status Recarga}), FIND('30 dias', {Status Recarga}), FIND('Vencido', {Status Inspeção}), FIND('30 dias', {Status Inspeção}))"
    })
}

export const osAPI = {
  getAll: () => getRecords('Ordens de Serviço'),
  getById: (id) => getRecordById('Ordens de Serviço', id),
  create: (fields) => createRecord('Ordens de Serviço', fields),
  update: (id, fields) => updateRecord('Ordens de Serviço', id, fields),
  remove: (id) => deleteRecord('Ordens de Serviço', id),
  getAbertas: () =>
    getRecords('Ordens de Serviço', {
      filterByFormula: "OR({Status}='Agendada',{Status}='Em Andamento')"
    })
}

export const certificadosAPI = {
  getAll: () => getRecords('Certificados'),
  getById: (id) => getRecordById('Certificados', id),
  create: (fields) => createRecord('Certificados', fields),
  update: (id, fields) => updateRecord('Certificados', id, fields),
  remove: (id) => deleteRecord('Certificados', id)
}

export { getRecords, getRecordById, createRecord, updateRecord, deleteRecord }
export default airtable
