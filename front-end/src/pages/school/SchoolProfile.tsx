import { useState, useEffect } from "react";
import { Building2, MapPin, Globe, Pencil, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { getSchoolProfile, updateSchoolProfile, type School } from "@/services/api";
import { useSetHeader } from "@/contexts/HeaderContext";
import React from "react";

// ── Field Row ──────────────────────────────────────────────────────────────────

function FieldRow({
  label,
  value,
  editing,
  name,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: string;
  editing: boolean;
  name: keyof School;
  onChange: (name: keyof School, val: string) => void;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        {editing ? (
          <Input
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            className="h-8 text-sm border-slate-200 focus:border-teal-400"
          />
        ) : (
          <p className="text-sm font-semibold text-slate-700">{value || <span className="text-slate-300 font-normal">—</span>}</p>
        )}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function SchoolProfile() {
  const [school, setSchool] = useState<School | null>(null);
  const [draft, setDraft] = useState<Partial<School>>({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── useHeader MUST be called unconditionally (Rules of Hooks) ──────────────
  useSetHeader({
    title: "School Profile",
    subtitle: "Manage your school's official information used across the system and in SF10 documents.",
    breadcrumbs: [
      { label: "School & Sections" },
      { label: "School Profile" },
    ],
    actions: (
      <div className="flex gap-2">
        {editing ? (
          <>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={handleCancel} disabled={saving}>
              <X className="w-3.5 h-3.5" /> Cancel
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800" onClick={handleSave} disabled={saving}>
              <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save Changes"}
            </Button>
          </>
        ) : (
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => setEditing(true)}>
            <Pencil className="w-3.5 h-3.5" /> Edit Profile
          </Button>
        )}
      </div>
    )
  });

  useEffect(() => {
    loadSchoolProfile();
  }, []);

  async function loadSchoolProfile() {
    try {
      const data = await getSchoolProfile();
      setSchool(data);
      setDraft(data);
    } catch (error) {
      console.error("Failed to load school profile:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(name: keyof School, value: string) {
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    if (!school) return;

    setSaving(true);
    try {
      await updateSchoolProfile(draft);
      setSchool(draft as School);
      setEditing(false);
    } catch (error) {
      console.error("Failed to save school profile:", error);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (school) {
      setDraft(school);
    }
    setEditing(false);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-sm text-slate-500 mt-2">Loading school profile...</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <div className="text-center">
          <p className="text-slate-500">Failed to load school profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-0 pt-5 px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-500" />
                School Information
              </CardTitle>
              {editing && (
                <Badge className="bg-teal-50 text-teal-600 text-[10px] border-teal-200 border">
                  Editing
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 divide-y divide-slate-100">
            <FieldRow label="School Name" value={draft.name || ''} name="name" editing={editing} onChange={handleChange} icon={Building2} />
            <FieldRow label="District" value={draft.district || ''} name="district" editing={editing} onChange={handleChange} icon={MapPin} />
            <FieldRow label="Division" value={draft.division || ''} name="division" editing={editing} onChange={handleChange} icon={MapPin} />
            <FieldRow label="Region" value={draft.region || ''} name="region" editing={editing} onChange={handleChange} icon={Globe} />
            <FieldRow label="Complete Address" value={draft.address || ''} name="address" editing={editing} onChange={handleChange} icon={MapPin} />
          </CardContent>
        </Card>

        <p className="text-[11px] text-slate-400 mt-4 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" />
          This information appears on all generated SF10 documents.
        </p>
      </div>

  );
}
