'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createService, updateService, deleteService, toggleServicePublished, type ServiceFormState } from '@/app/actions/services';

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  order: number;
  published: boolean;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
    >
      {pending ? 'Saving…' : label}
    </button>
  );
}

function ServiceForm({
  action,
  state,
  defaultValues,
  onCancel,
}: {
  action: (formData: FormData) => void;
  state: ServiceFormState;
  defaultValues?: Service;
  onCancel?: () => void;
}) {
  return (
    <form action={action} className="space-y-3">
      {state.error && (
        <p className="text-red-400 text-sm">{state.error}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">Title *</label>
          <input
            name="title"
            defaultValue={defaultValues?.title}
            required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
          />
          {state.fieldErrors?.title && <p className="text-red-400 text-xs mt-1">{state.fieldErrors.title}</p>}
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">
            Icon name <span className="text-slate-600 font-normal">(Lucide, e.g. Building2)</span>
          </label>
          <input
            name="icon"
            defaultValue={defaultValues?.icon ?? ''}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
            placeholder="Building2"
          />
        </div>
      </div>
      <div>
        <label className="block text-slate-400 text-xs font-medium mb-1">Description *</label>
        <textarea
          name="description"
          defaultValue={defaultValues?.description}
          required
          rows={2}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors resize-none"
        />
        {state.fieldErrors?.description && <p className="text-red-400 text-xs mt-1">{state.fieldErrors.description}</p>}
      </div>
      <div className="w-24">
        <label className="block text-slate-400 text-xs font-medium mb-1">Order</label>
        <input
          name="order"
          type="number"
          defaultValue={defaultValues?.order ?? 0}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
        />
      </div>
      <div className="flex gap-3 items-center">
        <SubmitButton label={defaultValues ? 'Save' : 'Add Service'} />
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-200 text-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function EditRow({ service, onClose }: { service: Service; onClose: () => void }) {
  const updateBound = updateService.bind(null, service.id);
  const [state, action] = useActionState<ServiceFormState, FormData>(updateBound, {});

  if ((state as ServiceFormState & { _done?: boolean })._done) {
    onClose();
  }

  return <ServiceForm action={action} state={state} defaultValues={service} onCancel={onClose} />;
}

export default function ServiceManager({ services: initial }: { services: Service[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addState, addAction] = useActionState<ServiceFormState, FormData>(createService, {});

  return (
    <div className="space-y-6">
      {/* Add new */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h3 className="text-slate-200 font-semibold text-sm mb-4">Add New Service</h3>
        <ServiceForm action={addAction} state={addState} />
      </div>

      {/* List */}
      {initial.length === 0 ? (
        <p className="text-slate-500 text-sm">No services yet.</p>
      ) : (
        <div className="space-y-3">
          {initial.map(service => (
            <div key={service.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              {editingId === service.id ? (
                <EditRow service={service} onClose={() => setEditingId(null)} />
              ) : (
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-200 font-semibold text-sm">{service.title}</span>
                      {service.icon && (
                        <span className="text-xs text-slate-500 font-mono bg-slate-700 px-1.5 py-0.5 rounded">
                          {service.icon}
                        </span>
                      )}
                      <span className="text-xs text-slate-600">#{service.order}</span>
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-2">{service.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleServicePublished(service.id, service.published)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        service.published
                          ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400'
                          : 'bg-slate-700 text-slate-400 hover:bg-green-500/10 hover:text-green-400'
                      }`}
                    >
                      {service.published ? 'Published' : 'Draft'}
                    </button>
                    <button
                      onClick={() => setEditingId(service.id)}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${service.title}"?`)) deleteService(service.id);
                      }}
                      className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
