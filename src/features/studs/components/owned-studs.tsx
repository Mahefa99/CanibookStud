import { DocumentUpload } from "@/src/features/stud-documents/forms";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

export async function OwnedStuds() {
  const db = createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data, error } = await db.from("studs").select("id,name,breed,status")
    .eq("owner_id",user.id).order("name");
  if (error) throw new Error("Unable to load your studs.");
  return <section className="space-y-4"><h1 className="font-display text-4xl">Your animals</h1>
    <Link className="underline" href="/dashboard/animals/new/stud">Add a male</Link>
    <Link className="ml-4 underline" href="/dashboard/animals/new/dam">Add a female (preview)</Link>
    {data.length ? <ul>{data.map(s => <li className="surface my-2 p-3" key={s.id}>{s.name} · {s.breed} · {s.status}<DocumentUpload stud={s.id}/></li>)}</ul> : <p>You have no registered studs yet.</p>}
  </section>;
}
