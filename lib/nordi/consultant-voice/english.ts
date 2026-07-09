import type { ConsultantVoiceCopy } from "@/lib/nordi/consultant-voice/types";

export const ENGLISH_COPY: ConsultantVoiceCopy = {
  soloOperatorReasoning:
    "Running everything yourself usually means every interruption affects the entire business.",
  smallTeamReasoning: [
    "With a small team, coordination often lives in a few people's heads.",
    "",
    "That is usually where follow-ups and scheduling drift show up first.",
  ].join("\n"),
  multiChannelReasoning: [
    "When customers reach you through several channels, context scatters quickly unless there is a clear place to track open requests.",
    "",
    "That pattern shows up in a lot of owner-led businesses.",
  ].join("\n"),
  singleChannelReasoning:
    "How customers reach you shapes where messages get dropped — especially when you are busy serving the customer in front of you.",
  frictionReasoning:
    "That kind of weekly friction is often where owners feel the business running them, not the other way around.",
  referralReasoning: [
    "Referral-driven businesses usually win on trust.",
    "",
    "That makes responsiveness and scheduling reliability especially visible to new customers.",
  ].join("\n"),
  industryDetailReasoning: (label) =>
    `For a ${label.toLowerCase()}, the operational details you are sharing matter more than generic software features.`,
  referralConnection: [
    [
      "That actually fits with what you have already told me.",
      "",
      "Referral businesses often depend heavily on responsiveness, so appointment scheduling becomes even more important.",
    ].join("\n"),
  ],
  schedulingContactConnection:
    "Given the scheduling pressure you mentioned, how do customers usually initiate contact today?",
  soloFrictionConnection:
    "As a solo operator, the friction you feel usually maps directly to how much context-switching you do in a day.",
  questionReasons: {
    "general-team-size": "Team size shapes where operational pressure shows up first.",
    "general-customer-contact": "Customer contact paths often reveal where follow-ups slip.",
    "general-friction":
      "I want to focus on the operational bottleneck that actually costs you time each week.",
    "dental-online-booking":
      "Online booking changes how much manual coordination happens at the front desk.",
    "dental-reminders":
      "Reminder follow-through is one of the clearest places patient experience and revenue meet.",
    "hvac-scheduling":
      "Scheduling is usually the hinge point between marketing promises and day-to-day service delivery.",
    "hvac-emergency":
      "After-hours demand is often where HVAC operations get expensive quickly.",
  },
  trustSummaryHeader: "So far, here is what I am seeing:",
  trustSummaryFooter: "That gives me a much clearer picture.",
  trustSummaryProse: (industry, friction, channels) => {
    const frictionSnippet = friction.length > 48 ? `${friction.slice(0, 45)}...` : friction;
    return `So far, I'm seeing a small ${industry} business where ${frictionSnippet.toLowerCase()} may matter more than how customers reach you via ${channels}.`;
  },
  trustSummaryBulleted: (parts, channels, friction) => {
    const bullets = [...parts];
    if (channels) bullets.push(`Customers reach you via ${channels}`);
    if (friction) {
      bullets.push(friction.length > 72 ? `${friction.slice(0, 69)}...` : friction);
    }
    return [
      "So far, here is what I am seeing:",
      "",
      ...bullets.map((item) => `• ${item.charAt(0).toUpperCase()}${item.slice(1)}`),
    ].join("\n");
  },
  soloOperatorLabel: "Solo operator",
  employeeCountLabel: (count) => `About ${count} people involved day to day`,
  customersViaLabel: (channels) => `Customers reach you via ${channels}`,
  recommendationLeads: [
    "A few patterns are starting to stand out in how the business runs day to day.",
    "Based on what you have shared, a few operational themes keep appearing.",
  ],
  recommendationFooter:
    "I would like to understand your current process a little better before we discuss possible improvements.",
  websitePermissionLeads: [
    "If you have a public website, reviewing it can help me connect what you are describing to what customers actually see.",
    "A quick look at your public website sometimes reveals gaps between how the business runs and how customers experience it.",
    "When owners describe operations well, I like to see whether the public website reflects that same clarity.",
  ],
  websiteUrlAckPrefix: "Good — I will review your public site while we keep talking.",
  websiteFinishedReview: "I finished reviewing your website.",
  noOnlineBooking: "I could not find online appointment booking",
  noContactForm: "there is not an obvious contact form for new inquiries",
  hvacEmergencyObs:
    "emergency service is prominent, which usually means after-hours coordination matters",
  schedulingAlignment: "That lines up with what you have been describing about scheduling.",
  websiteFrictionConnection: "",
  industryOpening: (label) => {
    const options = [
      `A ${label.toLowerCase()} — that gives me a useful starting point.`,
      `${label} — that context helps me ask better questions.`,
      `Understood — ${label.toLowerCase()} businesses often share similar operational pressure points.`,
    ];
    return options[Math.floor(Math.random() * options.length)];
  },
  websitePermissionPrompt:
    "Would you like me to take a quick look at your public website while we continue?",
  websiteUrlReady:
    "Great — paste your website URL whenever you're ready, and I'll review it while we keep talking.",
  websiteDeclinedLead: "No problem — we can keep learning from the conversation.",
  websiteDeclinedFollowUp:
    "What does a typical customer journey look like from first contact to completed service?",
  whileThatRunsPrefix: "While that runs,",
  customerFindYouFallback: "tell me more about how customers usually find you.",
  salesPressureDeflection: [
    "I want to understand your business properly before we talk about solutions.",
    "",
    "Help me with one more operational detail — what part of the week feels most repetitive for your team?",
  ],
  generalFrictionLead:
    "What you have described gives me a clearer picture of how the week actually runs.",
  generalFrictionQuestion:
    "What tends to create the most friction in a typical week — scheduling, follow-ups, staffing, or something else?",
  relationshipAcknowledgment: "",
};
