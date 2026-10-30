import { getRepo, remainingShares } from "@sundrop/data";
import { formatBdt } from "@sundrop/ui";

export default async function ProjectsPage() {
  const projects = await getRepo().listProjects();
  return (
    <>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400 }}>Investment projects</h1>
      <p className="sample">{projects[0]?.illustrativeYield}</p>
      <table>
        <thead><tr><th>Project</th><th>Sample price</th><th>Allocated</th><th>Reserved</th><th>Left</th><th>Status</th></tr></thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}<br /><span style={{ color: "#4a5653" }}>{project.location}</span></td>
              <td>{formatBdt(project.pricePerShare)}</td>
              <td>{project.soldShares}</td>
              <td>{project.reservedShares}</td>
              <td>{remainingShares(project)} / {project.totalShares}</td>
              <td>{project.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
