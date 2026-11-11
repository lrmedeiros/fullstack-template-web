import { render, screen } from "@testing-library/react";
import { TaskFilters } from "./TaskFilters";

describe("TaskFilters", () => {
  it("marks the active status and keeps the search in the links", () => {
    render(<TaskFilters status="done" search="pr" />);

    const nav = screen.getByRole("navigation", { name: "Filtrar por status" });
    const active = screen.getByRole("link", { name: "Concluída" });

    expect(nav).toContainElement(active);
    expect(active).toHaveAttribute("aria-current", "page");
    expect(active).toHaveAttribute("href", "/dashboard?status=done&search=pr");
    expect(screen.getByRole("link", { name: "Todas" })).toHaveAttribute(
      "href",
      "/dashboard?search=pr",
    );
  });

  it("renders an accessible search form", () => {
    render(<TaskFilters />);

    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar tarefas")).toHaveAttribute("name", "search");
  });
});
