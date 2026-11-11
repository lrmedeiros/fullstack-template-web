import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Task } from "@/lib/types";
import { TaskItem } from "./TaskItem";

jest.mock("@/actions/tasks", () => ({
  updateTaskStatus: jest.fn(),
  deleteTask: jest.fn(),
}));

const task: Task = {
  id: "22222222-2222-4222-8222-222222222222",
  title: "Revisar pull request",
  description: "Checar os testes",
  status: "todo",
  ownerId: "11111111-1111-4111-8111-111111111111",
  createdAt: "2026-11-11T12:00:00.000Z",
  updatedAt: "2026-11-11T12:00:00.000Z",
};

function renderItem(props: Partial<React.ComponentProps<typeof TaskItem>> = {}) {
  return render(
    <ul>
      <TaskItem task={task} {...props} />
    </ul>,
  );
}

describe("TaskItem", () => {
  it("shows the title, description and status", () => {
    renderItem();

    expect(screen.getByRole("heading", { name: "Revisar pull request" })).toBeInTheDocument();
    expect(screen.getByText("Checar os testes")).toBeInTheDocument();
    expect(screen.getByLabelText("Status de Revisar pull request")).toHaveValue("todo");
  });

  it("updates the status through the action", async () => {
    const onStatusChange = jest.fn().mockResolvedValue(undefined);
    renderItem({ onStatusChange });

    await userEvent.selectOptions(
      screen.getByLabelText("Status de Revisar pull request"),
      "Concluída",
    );

    expect(onStatusChange).toHaveBeenCalledWith(task.id, "done");
  });

  it("shows an error when the update fails", async () => {
    const onStatusChange = jest.fn().mockRejectedValue(new Error("boom"));
    renderItem({ onStatusChange });

    await userEvent.selectOptions(
      screen.getByLabelText("Status de Revisar pull request"),
      "Em andamento",
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível atualizar a tarefa.",
    );
  });

  it("asks for confirmation before deleting", async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);
    const confirm = jest.spyOn(window, "confirm");
    renderItem({ onDelete });
    const button = screen.getByRole("button", { name: "Excluir Revisar pull request" });

    confirm.mockReturnValueOnce(false);
    await userEvent.click(button);
    expect(onDelete).not.toHaveBeenCalled();

    confirm.mockReturnValueOnce(true);
    await userEvent.click(button);
    await waitFor(() => expect(onDelete).toHaveBeenCalledWith(task.id));

    confirm.mockRestore();
  });
});
