import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const defaultValues = {
  nome: '',
  tipo: '',
  cliente: '',
  localizacao: '',
  capacidade: '',
  dataFabricacao: '',
  dataValidade: '',
  status: '',
  statusRecarga: '',
  statusInspecao: '',
  observacoes: ''
}

/**
 * @param {{ initialValues?: object, isEditing?: boolean, isLoading?: boolean, clientes?: array, onSubmit: function, onCancel: function }} props
 */
export default function EquipamentosForm({
  initialValues,
  isEditing = false,
  isLoading = false,
  clientes = [],
  onSubmit,
  onCancel
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  useEffect(() => {
    if (initialValues) {
      reset({ ...defaultValues, ...initialValues })
    }
  }, [initialValues, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-group">
        <label>Nome *</label>
        <input
          className="form-control"
          type="text"
          {...register('nome', { required: 'Nome é obrigatório' })}
        />
        {errors.nome && <span className="field-error">{errors.nome.message}</span>}
      </div>

      <div className="form-group">
        <label>Tipo *</label>
        <select className="form-control" {...register('tipo', { required: 'Tipo é obrigatório' })}>
          <option value="">Selecione...</option>
          <option value="Extintor">Extintor</option>
          <option value="Hidrante">Hidrante</option>
          <option value="Mangueira">Mangueira</option>
          <option value="Detector de Fumaça">Detector de Fumaça</option>
          <option value="Sprinkler">Sprinkler</option>
          <option value="Outro">Outro</option>
        </select>
        {errors.tipo && <span className="field-error">{errors.tipo.message}</span>}
      </div>

      <div className="form-group">
        <label>Cliente</label>
        <select className="form-control" {...register('cliente')}>
          <option value="">Selecione um cliente...</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>
              {c.fields['Nome'] || c.id}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Localização</label>
        <input
          className="form-control"
          type="text"
          {...register('localizacao')}
        />
      </div>

      <div className="form-group">
        <label>Capacidade</label>
        <input
          className="form-control"
          type="text"
          placeholder="Ex: 6kg, 10L"
          {...register('capacidade')}
        />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Data de Fabricação</label>
          <input
            className="form-control"
            type="date"
            {...register('dataFabricacao')}
          />
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Data de Validade</label>
          <input
            className="form-control"
            type="date"
            {...register('dataValidade')}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Status</label>
        <select className="form-control" {...register('status')}>
          <option value="">Selecione...</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
          <option value="Em Manutenção">Em Manutenção</option>
          <option value="Vencido">Vencido</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Status Recarga</label>
          <select className="form-control" {...register('statusRecarga')}>
            <option value="">Selecione...</option>
            <option value="Em dia">Em dia</option>
            <option value="30 dias">Vence em 30 dias</option>
            <option value="Vencido">Vencido</option>
          </select>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Status Inspeção</label>
          <select className="form-control" {...register('statusInspecao')}>
            <option value="">Selecione...</option>
            <option value="Em dia">Em dia</option>
            <option value="30 dias">Vence em 30 dias</option>
            <option value="Vencido">Vencido</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Observações</label>
        <textarea
          className="form-control"
          rows={3}
          {...register('observacoes')}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
