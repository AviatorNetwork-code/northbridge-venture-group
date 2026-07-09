import { z } from "zod";
export declare const researchDocumentSectionSchema: z.ZodObject<{
    heading: z.ZodString;
    body: z.ZodString;
}, "strip", z.ZodTypeAny, {
    heading: string;
    body: string;
}, {
    heading: string;
    body: string;
}>;
export type ResearchDocumentSection = z.infer<typeof researchDocumentSectionSchema>;
/**
 * Platform schema for research documents stored under docs/.
 * Frontmatter is validated; markdown body is opaque at platform layer.
 */
export declare const researchDocumentSchema: z.ZodObject<{
    metadata: z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        version: z.ZodString;
        summary: z.ZodString;
        trustLevel: z.ZodEnum<["unverified", "reference_only", "adopt_concepts", "adopt_implementation", "avoid"]>;
        category: z.ZodEnum<["architecture", "security", "orchestration", "connectors", "observability", "mobile", "chat_ux", "dashboard", "external_patterns", "governance"]>;
        sources: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            url: z.ZodOptional<z.ZodString>;
            repository: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodString>;
            reviewedAt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            label: string;
            url?: string | undefined;
            repository?: string | undefined;
            version?: string | undefined;
            reviewedAt?: string | undefined;
        }, {
            label: string;
            url?: string | undefined;
            repository?: string | undefined;
            version?: string | undefined;
            reviewedAt?: string | undefined;
        }>, "many">;
        relatedAdrs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            adrId: z.ZodString;
            title: z.ZodString;
            packageScope: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<["proposed", "accepted", "superseded", "deprecated"]>>;
            path: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            adrId: string;
            title: string;
            path?: string | undefined;
            status?: "proposed" | "accepted" | "superseded" | "deprecated" | undefined;
            packageScope?: string | undefined;
        }, {
            adrId: string;
            title: string;
            path?: string | undefined;
            status?: "proposed" | "accepted" | "superseded" | "deprecated" | undefined;
            packageScope?: string | undefined;
        }>, "many">>;
        author: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        version: string;
        id: string;
        summary: string;
        trustLevel: "unverified" | "reference_only" | "adopt_concepts" | "adopt_implementation" | "avoid";
        category: "architecture" | "security" | "orchestration" | "connectors" | "observability" | "mobile" | "chat_ux" | "dashboard" | "external_patterns" | "governance";
        sources: {
            label: string;
            url?: string | undefined;
            repository?: string | undefined;
            version?: string | undefined;
            reviewedAt?: string | undefined;
        }[];
        relatedAdrs: {
            adrId: string;
            title: string;
            path?: string | undefined;
            status?: "proposed" | "accepted" | "superseded" | "deprecated" | undefined;
            packageScope?: string | undefined;
        }[];
        createdAt: string;
        updatedAt: string;
        tags: string[];
        author?: string | undefined;
    }, {
        title: string;
        version: string;
        id: string;
        summary: string;
        trustLevel: "unverified" | "reference_only" | "adopt_concepts" | "adopt_implementation" | "avoid";
        category: "architecture" | "security" | "orchestration" | "connectors" | "observability" | "mobile" | "chat_ux" | "dashboard" | "external_patterns" | "governance";
        sources: {
            label: string;
            url?: string | undefined;
            repository?: string | undefined;
            version?: string | undefined;
            reviewedAt?: string | undefined;
        }[];
        createdAt: string;
        updatedAt: string;
        relatedAdrs?: {
            adrId: string;
            title: string;
            path?: string | undefined;
            status?: "proposed" | "accepted" | "superseded" | "deprecated" | undefined;
            packageScope?: string | undefined;
        }[] | undefined;
        author?: string | undefined;
        tags?: string[] | undefined;
    }>;
    sections: z.ZodDefault<z.ZodArray<z.ZodObject<{
        heading: z.ZodString;
        body: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        heading: string;
        body: string;
    }, {
        heading: string;
        body: string;
    }>, "many">>;
    dispositionNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    metadata: {
        title: string;
        version: string;
        id: string;
        summary: string;
        trustLevel: "unverified" | "reference_only" | "adopt_concepts" | "adopt_implementation" | "avoid";
        category: "architecture" | "security" | "orchestration" | "connectors" | "observability" | "mobile" | "chat_ux" | "dashboard" | "external_patterns" | "governance";
        sources: {
            label: string;
            url?: string | undefined;
            repository?: string | undefined;
            version?: string | undefined;
            reviewedAt?: string | undefined;
        }[];
        relatedAdrs: {
            adrId: string;
            title: string;
            path?: string | undefined;
            status?: "proposed" | "accepted" | "superseded" | "deprecated" | undefined;
            packageScope?: string | undefined;
        }[];
        createdAt: string;
        updatedAt: string;
        tags: string[];
        author?: string | undefined;
    };
    sections: {
        heading: string;
        body: string;
    }[];
    dispositionNotes?: string | undefined;
}, {
    metadata: {
        title: string;
        version: string;
        id: string;
        summary: string;
        trustLevel: "unverified" | "reference_only" | "adopt_concepts" | "adopt_implementation" | "avoid";
        category: "architecture" | "security" | "orchestration" | "connectors" | "observability" | "mobile" | "chat_ux" | "dashboard" | "external_patterns" | "governance";
        sources: {
            label: string;
            url?: string | undefined;
            repository?: string | undefined;
            version?: string | undefined;
            reviewedAt?: string | undefined;
        }[];
        createdAt: string;
        updatedAt: string;
        relatedAdrs?: {
            adrId: string;
            title: string;
            path?: string | undefined;
            status?: "proposed" | "accepted" | "superseded" | "deprecated" | undefined;
            packageScope?: string | undefined;
        }[] | undefined;
        author?: string | undefined;
        tags?: string[] | undefined;
    };
    sections?: {
        heading: string;
        body: string;
    }[] | undefined;
    dispositionNotes?: string | undefined;
}>;
export type ResearchDocument = z.infer<typeof researchDocumentSchema>;
export declare const researchDocumentFrontmatterSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    version: z.ZodString;
    summary: z.ZodString;
    trustLevel: z.ZodEnum<["unverified", "reference_only", "adopt_concepts", "adopt_implementation", "avoid"]>;
    category: z.ZodEnum<["architecture", "security", "orchestration", "connectors", "observability", "mobile", "chat_ux", "dashboard", "external_patterns", "governance"]>;
    sources: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
        repository: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodString>;
        reviewedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        label: string;
        url?: string | undefined;
        repository?: string | undefined;
        version?: string | undefined;
        reviewedAt?: string | undefined;
    }, {
        label: string;
        url?: string | undefined;
        repository?: string | undefined;
        version?: string | undefined;
        reviewedAt?: string | undefined;
    }>, "many">;
    relatedAdrs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        adrId: z.ZodString;
        title: z.ZodString;
        packageScope: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["proposed", "accepted", "superseded", "deprecated"]>>;
        path: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        adrId: string;
        title: string;
        path?: string | undefined;
        status?: "proposed" | "accepted" | "superseded" | "deprecated" | undefined;
        packageScope?: string | undefined;
    }, {
        adrId: string;
        title: string;
        path?: string | undefined;
        status?: "proposed" | "accepted" | "superseded" | "deprecated" | undefined;
        packageScope?: string | undefined;
    }>, "many">>;
    author: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    version: string;
    id: string;
    summary: string;
    trustLevel: "unverified" | "reference_only" | "adopt_concepts" | "adopt_implementation" | "avoid";
    category: "architecture" | "security" | "orchestration" | "connectors" | "observability" | "mobile" | "chat_ux" | "dashboard" | "external_patterns" | "governance";
    sources: {
        label: string;
        url?: string | undefined;
        repository?: string | undefined;
        version?: string | undefined;
        reviewedAt?: string | undefined;
    }[];
    relatedAdrs: {
        adrId: string;
        title: string;
        path?: string | undefined;
        status?: "proposed" | "accepted" | "superseded" | "deprecated" | undefined;
        packageScope?: string | undefined;
    }[];
    createdAt: string;
    updatedAt: string;
    tags: string[];
    author?: string | undefined;
}, {
    title: string;
    version: string;
    id: string;
    summary: string;
    trustLevel: "unverified" | "reference_only" | "adopt_concepts" | "adopt_implementation" | "avoid";
    category: "architecture" | "security" | "orchestration" | "connectors" | "observability" | "mobile" | "chat_ux" | "dashboard" | "external_patterns" | "governance";
    sources: {
        label: string;
        url?: string | undefined;
        repository?: string | undefined;
        version?: string | undefined;
        reviewedAt?: string | undefined;
    }[];
    createdAt: string;
    updatedAt: string;
    relatedAdrs?: {
        adrId: string;
        title: string;
        path?: string | undefined;
        status?: "proposed" | "accepted" | "superseded" | "deprecated" | undefined;
        packageScope?: string | undefined;
    }[] | undefined;
    author?: string | undefined;
    tags?: string[] | undefined;
}>;
export type ResearchDocumentFrontmatter = z.infer<typeof researchDocumentFrontmatterSchema>;
