export const labels = {
  landingPage: {
    hero: {
      eyebrow: "The Sapien Paradox",
      title: "Evolution isn't a race.",
      titleGradient: " Knowledge shouldn't be either.",
      subtext: "We drone modular chapters across a gentle reading tempo, adaptive check-ins, and tangible deliverables so you can keep the magic of conversation alive.",
      primaryAction: "Enter the Library",
      secondaryAction: "Explore the Engine",
      stats: {
        liveRooms: "Live reading rooms",
        modularPathways: "Modular pathways",
        sapiens: "5,000+ sapiens"
      },
      cards: {
        paceSelector: "Interactive pace selector",
        modularEngine: "Modular engine live"
      }
    },
    library: {
      eyebrow: "Library",
      title: "The Interactive Library",
      subtext: "We blend codices, raconteurs, and adaptive cues so the story remains alive.",
      oldWay: {
        label: "THE OLD WAY",
        title: "Books as monoliths",
        desc: "Rigid chapters, dusty indexes, no feedback loop.",
        items: ["One-size-fits-all delivery", "Static pacing", "Limited reflection prompts"]
      },
      parasokWay: {
        label: "THE PARASOK WAY",
        title: "Living compendiums",
        desc: "Modulating rhythm, communal insights, and adaptive signposts.",
        items: ["Choose a focus, we assemble the flow", "Signals tune the tempo always", "Every packet comes with reflective cues"]
      }
    },
    modularEngine: {
      eyebrow: "Process",
      title: "Modular Engine",
      subtext: "Our process keeps your journey manageable but alive.",
      tiles: [
        { title: "Select Your Path", description: "Decide which story, theme, or lens you want to explore first.", icon: "\u{1F702}", step: "01" },
        { title: "Set Your Tempo", description: "Choose calm, steady, or rapid delivery windows.", icon: "\u23F1", step: "02" },
        { title: "Receive & Absorb", description: "Chapters drop only when you finish the prior target.", icon: "\uD83D\uDCDA", step: "03" },
        { title: "Feedback Loop", description: "Questions adapt to your responses; the next packet shifts accordingly.", icon: "\uD83E\uDDE0", step: "04" }
      ]
    },
    paceSelector: {
      eyebrow: "Tempo",
      title: "Reading Pace",
      subtext: "Choose how the Sapien Paradox breathes chapters at you.",
      options: [
        { value: "crawl", label: "Crawl", description: "Micro-chapters and reflective pauses.", speed: 3 },
        { value: "steady", label: "Steady", description: "Balanced chunks and adaptive cues.", speed: 2 },
        { value: "soar", label: "Soar", description: "Rapid packets with summarised insights.", speed: 1 }
      ]
    },
    cta: {
      eyebrow: "The Sapien Paradox",
      title: "Join 5,000+ sapiens rewriting the way we learn.",
      subtext: "Fill the form, tell us your intent, and we will send the first packet curated to you.",
      button: "Use the form"
    },
    books: [
      { id: "pathfinder", title: "Pathfinder Codex", tagline: "The Navigator's Guide", summary: "A modular journey through the first 500 years of the paradox." },
      { id: "solstice", title: "Solstice of the Soul", tagline: "Inner Algorithms", summary: "Mapping the subjective experience of time and change." },
      { id: "aurora", title: "Aurora Algorithm", tagline: "Machine Dreams", summary: "A technical yet poetic breakdown of the first sentient codebase." }
    ],
    signUp: {
      eyebrow: "Sign up",
      title: "Personalize how you receive each chapter.",
      meta: "We route harvesters from the library to your inbox; the form keep tabs on your intent and pace so you never miss a rhythm.",
      selectedPaths: "Selected paths: {{title}}",
      pickFocus: "Pick a focus",
      tempo: "Tempo: {{pace}}",
      maybeLater: "Maybe later",
      sending: "Sending...",
      sendModule: "Send me the first module",
      choose: "Choose",
      selectedBookInfo: "<strong>{{title}}</strong> · pace: {{pace}}",
      fields: {
        fullName: {
          label: "Full name",
          placeholder: "Maria S. / Professor of Narrative Systems"
        },
        email: {
          label: "Sapien email",
          placeholder: "sapien@paradox.io"
        },
        selectedBook: {
          label: "Book focus"
        },
        paceNotes: {
          label: "Reading intention",
          placeholder: "What do you want to achieve after the first 3 chapters?"
        }
      }
    }
  },
  app: {
    shell: {
      signIn: "Sign in"
    },
    login: {
      eyebrow: "Gateway",
      title: "Continue to your Sapien workspace",
      subtitle: "Enter your credentials to tune into your rhythm.",
      emailLabel: "Email",
      emailPlaceholder: "sapien@paradox.io",
      passwordLabel: "Password",
      passwordPlaceholder: "••••••••",
      submitButton: "Sign in",
      signingIn: "Tuning in...",
      backToLanding: "Back to landing",
      errorInvalid: "Invalid credentials. Please check your rhythm.",
      errorGeneric: "Couldn't sign in, try again.",
      roles: {
        reader: {
          title: "Reader",
          description: "Track your reading tempo and curated chapters"
        },
        admin: {
          title: "Admin",
          description: "Manage the platform, inspect matrices, export analytics"
        }
      }
    },
    views: {
      common: {
        backToProfile: "Back to profile",
        jumpToReadingRoom: "Jump to reading room",
        openReadingRoom: "Open reading room",
        goToAdminView: "Go to admin view",
        logout: "Logout"
      },
      admin: {
        eyebrow: "Admin view",
        title: "Operational deck",
        subtitle: "Download the latest intake sheets, reconcile submissions, and keep the Sapien metrics honest.",
        dashboard: [
          { title: "Excel sheets", desc: "Recent leads · Submission statuses · Pace telemetry" },
          { title: "Signals", desc: "Alerts, flags, and cross-comparisons for every cohort." },
          { title: "Analytics", desc: "Reading velocity, drop-off points, engagement heat." }
        ]
      },
      profile: {
        eyebrow: "Profile",
        adminTitle: "Admin console",
        readerTitle: "Reader profile",
        adminSubtitle: "Manage the platform, inspect matrices, and export the analytics you need.",
        readerSubtitle: "Track your reading tempo and let Sapien curate your next chapters.",
        stats: {
          chapters: "Chapters read",
          pace: "Current pace",
          activePaths: "Active paths"
        }
      },
      readingRoom: {
        eyebrow: "Shared reading room",
        title: "Current session",
        subtitle: "Live annotations, curated excerpts, and paced check-ins stream here for every sapien.",
        feed: ["Chapter 3: The Mirror Paradox", "Annotation by @kai: perspective shifts...", "Next check-in in 4 min"]
      }
    }
  },
  shards: {
    viewer: {
      loading: "Manifesting Shard...",
      expired: {
        title: "Shard Returned",
        description: "The temporal window for this knowledge has closed. Shards are fleeting, depth is eternal.",
        action: "Back to Library"
      },
      hint: "Pinch to zoom · Scroll to absorb"
    }
  },
  readingRoom: {
    loading: "Manifesting the chamber...",
    errors: {
      invalid: {
        title: "This link is invalid or expired.",
        body: "The temporal window has closed. Request a fresh chapter from your profile."
      },
      locked: {
        title: "This chapter unlocks soon.",
        body: "Stay with the cadence. The next packet is on its way."
      },
      network: {
        title: "Couldn't reach the chamber.",
        body: "Try refreshing the page in a moment."
      }
    },
    sanctuary: {
      title: "You've finished Chapter {{orderIndex}}.",
      body: "The next arrives on WhatsApp.",
      bookFooter: "{{bookTitle}}"
    }
  }
};
