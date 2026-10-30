import { getRepo } from "@sundrop/data";
import { RequestDesk } from "./desk";

export default async function RequestsPage() {
  const [applications, projects] = await Promise.all([getRepo().listApplications(), getRepo().listProjects()]);
  const priceByProject = Object.fromEntries(projects.map((project) => [project.name, project.pricePerShare]));
  return (
    <>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400 }}>Investment requests</h1>
      <p>Approving moves reserved sample shares into the allocated count on the public project page. Declining releases them. No money moves.</p>
      <RequestDesk rows={applications} priceByProject={priceByProject} />
    </>
  );
}
