import { test, expect } from "@playwright/test";

test("Manage Todo tasks @sanity", async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/dist/");

  // Reusable locators
  const todoInput = page.getByTestId("text-input");
  const todoList = page.getByTestId("todo-list");
  const todoItems = todoList.getByRole("listitem");

  // Test data
  const tasks = [
    "Drink 3lit water",
    "sleep 8 hour",
    "Run 1km",
    "Learn Technology",
    "Read books",
    "Perform pooja",
  ];

  // Add all tasks
  for (const task of tasks) {
    await todoInput.fill(task);
    await todoInput.press("Enter");
  }

  // Verify all six tasks are added
  await expect(todoItems).toHaveCount(6);

  // Reusable function to complete a task
  const completeTask = async (taskName: string) => {
    const task = todoItems.filter({
      has: page.getByText(taskName, { exact: true }),
    });

    const checkbox = task.getByTestId("todo-item-toggle");

    await expect(task).toBeVisible();
    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();

    // Click the checkbox to complete the task
    await checkbox.click();
  };

  // Complete three selected tasks in the All view
  for (const task of ["Drink 3lit water", "Run 1km", "Read books"]) {
    await completeTask(task);
  }

  // Verify Completed filter
  await page.getByRole("link", { name: "Completed" }).click();

  await expect(todoItems).toHaveCount(3);
  await expect(todoList).toContainText("Drink 3lit water");
  await expect(todoList).toContainText("Run 1km");
  await expect(todoList).toContainText("Read books");

  // Verify Active filter
  await page.getByRole("link", { name: "Active" }).click();

  await expect(todoItems).toHaveCount(3);
  await expect(todoList).toContainText("sleep 8 hour");
  await expect(todoList).toContainText("Learn Technology");
  await expect(todoList).toContainText("Perform pooja");

  // Complete another task in the Active view
  await completeTask("sleep 8 hour");

  // The completed task should disappear from Active
  await expect(todoItems).toHaveCount(2);
  await expect(todoList).toContainText("Learn Technology");
  await expect(todoList).toContainText("Perform pooja");
  await expect(todoList).not.toContainText("sleep 8 hour");

  // Return to All tasks
  await page.getByRole("link", { name: "All" }).click();

  // Verify all six tasks still exist
  await expect(todoItems).toHaveCount(6);

  // Verify the newly completed task remains checked
  const sleepTask = todoItems.filter({
    has: page.getByText("sleep 8 hour", { exact: true }),
  });

  await expect(sleepTask.getByTestId("todo-item-toggle")).toBeChecked();

  // Verify the other completed tasks remain checked
  for (const taskName of ["Drink 3lit water", "Run 1km", "Read books"]) {
    const task = todoItems.filter({
      has: page.getByText(taskName, { exact: true }),
    });

    await expect(task.getByTestId("todo-item-toggle")).toBeChecked();
  }
});


/* initial script generated from codegen

 import { test, expect } from "@playwright/test";

test("todo list @sanity", async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/dist/");
  await page.getByTestId("text-input").click();
  await page.getByTestId("text-input").fill("Drink 3lit water");
  await page.getByTestId("text-input").press("Enter");
  await page.getByTestId("text-input").click();
  await page.getByTestId("text-input").fill("sleep 8 hour");
  await page.getByTestId("text-input").press("Enter");
  await page.getByTestId("text-input").fill("Run 1km");
  await page.getByTestId("text-input").press("Enter");
  await page.getByTestId("text-input").fill("Learn Technology");
  await page.getByTestId("text-input").press("Enter");
  await page.gettByTestId("text-input").fill("Read books");
  await page.getByTestId("text-input").press("Enter");
  await page.getByTestId("text-input").fill("Perform pooja");
  await page.getByTestId("text-input").press("Enter");
  await page.getByText("Drink 3lit water").click();
  await page
    .getByRole("listitem")
    .filter({ hasText: "Drink 3lit water" })
    .getByTestId("todo-item-toggle")
    .check();
  await page
    .getByRole("listitem")
    .filter({ hasText: "Run 1km" })
    .getByTestId("todo-item-toggle")
    .check();
  await page
    .getByRole("listitem")
    .filter({ hasText: "Read books" })
    .getByTestId("todo-item-toggle")
    .check();
  await page.getByRole("link", { name: "Completed" }).click();
  await page.getByRole("link", { name: "Active" }).click();
  await expect(page.getByTestId("todo-list")).toContainText("Learn Technology");
  await page
    .getByRole("listitem")
    .filter({ hasText: "sleep 8 hour" })
    .getByTestId("todo-item-toggle")
    .check();
  await page.getByRole("link", { name: "All" }).click();
});

*/