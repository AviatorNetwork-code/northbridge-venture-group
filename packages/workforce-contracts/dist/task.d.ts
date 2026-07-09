import { z } from "zod";
export declare const taskStatusSchema: z.ZodEnum<["pending", "accepted", "in_progress", "completed", "rejected", "escalated"]>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
/**
 * Internal work unit delegated from Team Lead to Specialist.
 * @see docs/northbridge-digital-workforce-communication-protocol-v1.md Layer 3
 */
export declare const taskSchema: z.ZodObject<{
    id: z.ZodString;
    orgId: z.ZodString;
    teamId: z.ZodString;
    specialistId: z.ZodOptional<z.ZodString>;
    assignedByTeamLeadId: z.ZodString;
    status: z.ZodEnum<["pending", "accepted", "in_progress", "completed", "rejected", "escalated"]>;
    permissions: z.ZodObject<{
        canDo: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        cannotDo: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        canDo: string[];
        cannotDo: string[];
    }, {
        canDo?: string[] | undefined;
        cannotDo?: string[] | undefined;
    }>;
    context: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    deadline: z.ZodOptional<z.ZodString>;
    customerThreadRef: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    status: "pending" | "accepted" | "in_progress" | "completed" | "rejected" | "escalated";
    createdAt: string;
    updatedAt: string;
    id: string;
    orgId: string;
    teamId: string;
    permissions: {
        canDo: string[];
        cannotDo: string[];
    };
    assignedByTeamLeadId: string;
    context: Record<string, unknown>;
    specialistId?: string | undefined;
    deadline?: string | undefined;
    customerThreadRef?: string | undefined;
}, {
    status: "pending" | "accepted" | "in_progress" | "completed" | "rejected" | "escalated";
    createdAt: string;
    updatedAt: string;
    id: string;
    orgId: string;
    teamId: string;
    permissions: {
        canDo?: string[] | undefined;
        cannotDo?: string[] | undefined;
    };
    assignedByTeamLeadId: string;
    specialistId?: string | undefined;
    context?: Record<string, unknown> | undefined;
    deadline?: string | undefined;
    customerThreadRef?: string | undefined;
}>;
export type Task = z.infer<typeof taskSchema>;
export declare const taskArtifactSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    uri: z.ZodOptional<z.ZodString>;
    label: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    type: string;
    id: string;
    uri?: string | undefined;
    label?: string | undefined;
}, {
    type: string;
    id: string;
    uri?: string | undefined;
    label?: string | undefined;
}>;
export type TaskArtifact = z.infer<typeof taskArtifactSchema>;
export declare const taskResultSchema: z.ZodObject<{
    taskId: z.ZodString;
    summary: z.ZodString;
    evidence: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    artifacts: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodString;
        uri: z.ZodOptional<z.ZodString>;
        label: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        type: string;
        id: string;
        uri?: string | undefined;
        label?: string | undefined;
    }, {
        type: string;
        id: string;
        uri?: string | undefined;
        label?: string | undefined;
    }>, "many">>;
    escalationId: z.ZodOptional<z.ZodString>;
    completedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    summary: string;
    taskId: string;
    evidence: string[];
    artifacts: {
        type: string;
        id: string;
        uri?: string | undefined;
        label?: string | undefined;
    }[];
    completedAt: string;
    escalationId?: string | undefined;
}, {
    summary: string;
    taskId: string;
    completedAt: string;
    evidence?: string[] | undefined;
    artifacts?: {
        type: string;
        id: string;
        uri?: string | undefined;
        label?: string | undefined;
    }[] | undefined;
    escalationId?: string | undefined;
}>;
export type TaskResult = z.infer<typeof taskResultSchema>;
export declare function parseTask(input: unknown): Task;
export declare function parseTaskResult(input: unknown): TaskResult;
export declare function safeParseTask(input: unknown): z.SafeParseReturnType<{
    status: "pending" | "accepted" | "in_progress" | "completed" | "rejected" | "escalated";
    createdAt: string;
    updatedAt: string;
    id: string;
    orgId: string;
    teamId: string;
    permissions: {
        canDo?: string[] | undefined;
        cannotDo?: string[] | undefined;
    };
    assignedByTeamLeadId: string;
    specialistId?: string | undefined;
    context?: Record<string, unknown> | undefined;
    deadline?: string | undefined;
    customerThreadRef?: string | undefined;
}, {
    status: "pending" | "accepted" | "in_progress" | "completed" | "rejected" | "escalated";
    createdAt: string;
    updatedAt: string;
    id: string;
    orgId: string;
    teamId: string;
    permissions: {
        canDo: string[];
        cannotDo: string[];
    };
    assignedByTeamLeadId: string;
    context: Record<string, unknown>;
    specialistId?: string | undefined;
    deadline?: string | undefined;
    customerThreadRef?: string | undefined;
}>;
