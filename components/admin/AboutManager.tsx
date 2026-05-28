'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  createExperience, updateExperience, deleteExperience,
  createEducation, updateEducation, deleteEducation,
  createSkill, updateSkill, deleteSkill,
  createCertification, updateCertification, deleteCertification,
  type AboutFormState,
} from '@/app/actions/about';

type Exp = { id: string; role: string; company: string; period: string; description: string; order: number };
type Edu = { id: string; degree: string; institution: string; year: string; order: number };
type Skl = { id: string; category: string; items: string[]; order: number };
type Cert = { id: string; name: string; order: number };

function Btn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
      {pending ? 'Saving…' : label}
    </button>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-red-400 text-xs mt-1">{msg}</p> : null;
}

// ─── Experience ───────────────────────────────────────────────────────────────
function ExpForm({ action, state, def, onCancel }: {
  action: (fd: FormData) => void; state: AboutFormState;
  def?: Exp; onCancel?: () => void;
}) {
  return (
    <form action={action} className="space-y-3 p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
      {state.error && <p className="text-red-400 text-sm">{state.error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs font-medium block mb-1">Role *</label>
          <input name="role" defaultValue={def?.role} required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
          <FieldError msg={state.fieldErrors?.role} />
        </div>
        <div>
          <label className="text-slate-400 text-xs font-medium block mb-1">Company *</label>
          <input name="company" defaultValue={def?.company} required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
          <FieldError msg={state.fieldErrors?.company} />
        </div>
        <div>
          <label className="text-slate-400 text-xs font-medium block mb-1">Period</label>
          <input name="period" defaultValue={def?.period} placeholder="2020 – Present"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
        </div>
        <div>
          <label className="text-slate-400 text-xs font-medium block mb-1">Order</label>
          <input name="order" type="number" defaultValue={def?.order ?? 0}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
        </div>
      </div>
      <div>
        <label className="text-slate-400 text-xs font-medium block mb-1">Description</label>
        <textarea name="description" defaultValue={def?.description} rows={2}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 resize-none" />
      </div>
      <div className="flex gap-3">
        <Btn label={def ? 'Save' : 'Add Experience'} />
        {onCancel && <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-200 text-sm">Cancel</button>}
      </div>
    </form>
  );
}

function ExpEdit({ item, onClose }: { item: Exp; onClose: () => void }) {
  const [state, action] = useActionState<AboutFormState, FormData>(updateExperience.bind(null, item.id), {});
  return <ExpForm action={action} state={state} def={item} onCancel={onClose} />;
}

// ─── Education ────────────────────────────────────────────────────────────────
function EduForm({ action, state, def, onCancel }: {
  action: (fd: FormData) => void; state: AboutFormState;
  def?: Edu; onCancel?: () => void;
}) {
  return (
    <form action={action} className="space-y-3 p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
      {state.error && <p className="text-red-400 text-sm">{state.error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="text-slate-400 text-xs font-medium block mb-1">Degree *</label>
          <input name="degree" defaultValue={def?.degree} required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
          <FieldError msg={state.fieldErrors?.degree} />
        </div>
        <div>
          <label className="text-slate-400 text-xs font-medium block mb-1">Year</label>
          <input name="year" defaultValue={def?.year} placeholder="2019"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-slate-400 text-xs font-medium block mb-1">Institution *</label>
          <input name="institution" defaultValue={def?.institution} required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
        </div>
        <div>
          <label className="text-slate-400 text-xs font-medium block mb-1">Order</label>
          <input name="order" type="number" defaultValue={def?.order ?? 0}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
        </div>
      </div>
      <div className="flex gap-3">
        <Btn label={def ? 'Save' : 'Add Education'} />
        {onCancel && <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-200 text-sm">Cancel</button>}
      </div>
    </form>
  );
}

function EduEdit({ item, onClose }: { item: Edu; onClose: () => void }) {
  const [state, action] = useActionState<AboutFormState, FormData>(updateEducation.bind(null, item.id), {});
  return <EduForm action={action} state={state} def={item} onCancel={onClose} />;
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function SklForm({ action, state, def, onCancel }: {
  action: (fd: FormData) => void; state: AboutFormState;
  def?: Skl; onCancel?: () => void;
}) {
  return (
    <form action={action} className="space-y-3 p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
      {state.error && <p className="text-red-400 text-sm">{state.error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs font-medium block mb-1">Category *</label>
          <input name="category" defaultValue={def?.category} placeholder="e.g. Structural"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
          <FieldError msg={state.fieldErrors?.category} />
        </div>
        <div>
          <label className="text-slate-400 text-xs font-medium block mb-1">Order</label>
          <input name="order" type="number" defaultValue={def?.order ?? 0}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
        </div>
      </div>
      <div>
        <label className="text-slate-400 text-xs font-medium block mb-1">
          Skills <span className="text-slate-600 font-normal">(comma-separated)</span>
        </label>
        <input name="items" defaultValue={def?.items.join(', ')} placeholder="AutoCAD, ETABS, SAP2000"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
        <FieldError msg={state.fieldErrors?.items} />
      </div>
      <div className="flex gap-3">
        <Btn label={def ? 'Save' : 'Add Skill Group'} />
        {onCancel && <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-200 text-sm">Cancel</button>}
      </div>
    </form>
  );
}

function SklEdit({ item, onClose }: { item: Skl; onClose: () => void }) {
  const [state, action] = useActionState<AboutFormState, FormData>(updateSkill.bind(null, item.id), {});
  return <SklForm action={action} state={state} def={item} onCancel={onClose} />;
}

// ─── Certifications ───────────────────────────────────────────────────────────
function CertForm({ action, state, def, onCancel }: {
  action: (fd: FormData) => void; state: AboutFormState;
  def?: Cert; onCancel?: () => void;
}) {
  return (
    <form action={action} className="flex gap-3 items-end p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
      {state.error && <p className="text-red-400 text-sm">{state.error}</p>}
      <div className="flex-1">
        <label className="text-slate-400 text-xs font-medium block mb-1">Certification name *</label>
        <input name="name" defaultValue={def?.name} required
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
        <FieldError msg={state.fieldErrors?.name} />
      </div>
      <div className="w-20">
        <label className="text-slate-400 text-xs font-medium block mb-1">Order</label>
        <input name="order" type="number" defaultValue={def?.order ?? 0}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
      </div>
      <Btn label={def ? 'Save' : 'Add'} />
      {onCancel && <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-200 text-sm pb-2">Cancel</button>}
    </form>
  );
}

function CertEdit({ item, onClose }: { item: Cert; onClose: () => void }) {
  const [state, action] = useActionState<AboutFormState, FormData>(updateCertification.bind(null, item.id), {});
  return <CertForm action={action} state={state} def={item} onCancel={onClose} />;
}

// ─── Generic list row ─────────────────────────────────────────────────────────
function ListRow({ title, sub, order, onEdit, onDelete }: {
  title: string; sub?: string; order: number;
  onEdit: () => void; onDelete: () => void;
}) {
  return (
    <div className="flex items-start justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-slate-200 font-medium text-sm">{title}</p>
          <span className="text-slate-600 text-xs">#{order}</span>
        </div>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
      <div className="flex gap-2 shrink-0 ml-4">
        <button onClick={onEdit}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors">Edit</button>
        <button onClick={onDelete}
          className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition-colors">Delete</button>
      </div>
    </div>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <h2 className="text-white font-semibold text-sm">{title}</h2>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AboutManager({
  experiences, educations, skills, certifications,
}: {
  experiences: Exp[]; educations: Edu[]; skills: Skl[]; certifications: Cert[];
}) {
  const [expEdit, setExpEdit] = useState<string | null>(null);
  const [eduEdit, setEduEdit] = useState<string | null>(null);
  const [sklEdit, setSklEdit] = useState<string | null>(null);
  const [certEdit, setCertEdit] = useState<string | null>(null);
  const [addExpState, addExpAction] = useActionState<AboutFormState, FormData>(createExperience, {});
  const [addEduState, addEduAction] = useActionState<AboutFormState, FormData>(createEducation, {});
  const [addSklState, addSklAction] = useActionState<AboutFormState, FormData>(createSkill, {});
  const [addCertState, addCertAction] = useActionState<AboutFormState, FormData>(createCertification, {});

  return (
    <div className="space-y-6">
      {/* Experience */}
      <Section title="Experience">
        <ExpForm action={addExpAction} state={addExpState} />
        {experiences.map(e => (
          <div key={e.id}>
            {expEdit === e.id
              ? <ExpEdit item={e} onClose={() => setExpEdit(null)} />
              : <ListRow title={e.role} sub={`${e.company} · ${e.period}`} order={e.order}
                  onEdit={() => setExpEdit(e.id)}
                  onDelete={() => { if (confirm(`Delete "${e.role}"?`)) deleteExperience(e.id); }} />}
          </div>
        ))}
      </Section>

      {/* Education */}
      <Section title="Education">
        <EduForm action={addEduAction} state={addEduState} />
        {educations.map(e => (
          <div key={e.id}>
            {eduEdit === e.id
              ? <EduEdit item={e} onClose={() => setEduEdit(null)} />
              : <ListRow title={e.degree} sub={`${e.institution} · ${e.year}`} order={e.order}
                  onEdit={() => setEduEdit(e.id)}
                  onDelete={() => { if (confirm(`Delete "${e.degree}"?`)) deleteEducation(e.id); }} />}
          </div>
        ))}
      </Section>

      {/* Skills */}
      <Section title="Technical Skills">
        <SklForm action={addSklAction} state={addSklState} />
        {skills.map(s => (
          <div key={s.id}>
            {sklEdit === s.id
              ? <SklEdit item={s} onClose={() => setSklEdit(null)} />
              : <ListRow title={s.category} sub={s.items.join(', ')} order={s.order}
                  onEdit={() => setSklEdit(s.id)}
                  onDelete={() => { if (confirm(`Delete "${s.category}" group?`)) deleteSkill(s.id); }} />}
          </div>
        ))}
      </Section>

      {/* Certifications */}
      <Section title="Certifications">
        <CertForm action={addCertAction} state={addCertState} />
        {certifications.map(c => (
          <div key={c.id}>
            {certEdit === c.id
              ? <CertEdit item={c} onClose={() => setCertEdit(null)} />
              : <ListRow title={c.name} order={c.order}
                  onEdit={() => setCertEdit(c.id)}
                  onDelete={() => { if (confirm(`Delete "${c.name}"?`)) deleteCertification(c.id); }} />}
          </div>
        ))}
      </Section>
    </div>
  );
}
