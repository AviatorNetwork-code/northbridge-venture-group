import type { PromptTemplate, PromptTemplateRegistry } from "../types/template.js";

export class InMemoryPromptTemplateRegistry implements PromptTemplateRegistry {
  private readonly templates = new Map<string, PromptTemplate>();

  registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.templateId, template);
  }

  getTemplate(templateId: string): PromptTemplate | undefined {
    return this.templates.get(templateId);
  }

  hasTemplate(templateId: string): boolean {
    return this.templates.has(templateId);
  }

  listTemplates(): PromptTemplate[] {
    return [...this.templates.values()];
  }
}

export function createPromptTemplateRegistry(
  templates: PromptTemplate[],
): InMemoryPromptTemplateRegistry {
  const registry = new InMemoryPromptTemplateRegistry();
  for (const template of templates) {
    registry.registerTemplate(template);
  }
  return registry;
}
