import { useMemo, useState } from "react";

function rankCareer(career, query) {
  const haystack = [
    career.title,
    career.team,
    career.location,
    career.type,
    career.description
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  query.split(" ").forEach((token) => {
    if (token && haystack.includes(token)) {
      score += 1;
    }
  });

  if (haystack.includes(query)) {
    score += 3;
  }

  return score;
}

function topMatches(careers, query, limit = 3) {
  return careers
    .map((career) => ({ career, score: rankCareer(career, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.career);
}

function buildReply(input, careers, premiumFee) {
  const query = input.trim().toLowerCase();
  const roles = careers || [];

  if (!query) {
    return {
      text: "Ask about open jobs, remote roles, Nairobi openings, how to apply, or premium fast hiring.",
      matches: []
    };
  }

  if (roles.length === 0) {
    return {
      text: "I do not have any live role data loaded right now.",
      matches: []
    };
  }
  if (query.includes("help") || query.includes("what can you do")) {
    return {
      text: `I can answer questions about the ${roles.length} live openings. Try asking for remote roles, full-time jobs, a team like engineering, or how premium fast hiring works.`,
      matches: []
    };
  }
  if (query.includes("who are you") || query.includes("what are you")) {
    return {
      text: "I am the jobs assistant bot. I can help you find and apply to open roles, and explain how premium fast hiring works.",
      matches: []
    };
  }
  if (query.includes("why") && query.includes("premium")) {
    return {
      text: `Premium fast hiring is a paid prioritization service. It helps workers get in front of employers faster for a fee of ${premiumFee}.`,
      matches: roles.filter((career) => career.type.toLowerCase().includes("full")).slice(0, 3)
    };
  }
  if (query.includes("how") && query.includes("premium")) {
    return {
      text: `To use premium fast hiring, select the option when applying to a role. Pay the fee of ${premiumFee} to have your application surfaced faster to employers and high-intent opportunities.`,
      matches: roles.filter((career) => career.type.toLowerCase().includes("full")).slice(0, 3)
    };
  }
    if (/(hello|hi|hey|good morning|good evening)/.test(query)) {
    return {
      text: `I can help you scan ${roles.length} live openings. Ask for remote roles, full-time jobs, a team like engineering, or how premium fast hiring works.`,
      matches: roles.slice(0, 3)
    };
  }

  if (query.includes("premium") || query.includes("fast hire") || query.includes("priority")) {
    return {
      text: `Premium fast hiring is the priority-introduction flow. Workers pay ${premiumFee} to be surfaced faster to hiring employers and high-intent opportunities.`,
      matches: roles.filter((career) => career.type.toLowerCase().includes("full")).slice(0, 3)
    };
  }

  if (query.includes("apply") || query.includes("application")) {
    return {
      text: "To apply, open a matching role card and use its apply link. Strong applications usually mention relevant skills, location fit, and delivery speed.",
      matches: roles.slice(0, 3)
    };
  }

  if (query.includes("remote")) {
    const remoteRoles = roles.filter((career) => career.location.toLowerCase().includes("remote"));
    return {
      text: remoteRoles.length
        ? `I found ${remoteRoles.length} role${remoteRoles.length > 1 ? "s" : ""} with remote availability.`
        : "There are no explicitly remote roles listed right now.",
      matches: remoteRoles
    };
  }

  if (query.includes("full-time") || query.includes("full time")) {
    const fullTimeRoles = roles.filter((career) => career.type.toLowerCase().includes("full"));
    return {
      text: fullTimeRoles.length
        ? `There are ${fullTimeRoles.length} full-time openings available right now.`
        : "I could not find any full-time openings in the current listings.",
      matches: fullTimeRoles
    };
  }

  if (query.includes("contract") || query.includes("freelance")) {
    const contractRoles = roles.filter((career) => {
      const typeValue = career.type.toLowerCase();
      return typeValue.includes("contract") || typeValue.includes("freelance");
    });
    return {
      text: contractRoles.length
        ? `I found ${contractRoles.length} contract-style opening${contractRoles.length > 1 ? "s" : ""}.`
        : "I do not see any contract or freelance roles right now.",
      matches: contractRoles
    };
  }

  if (query.includes("nairobi") || query.includes("kenya") || query.includes("africa")) {
    const regionalRoles = roles.filter((career) => {
      const location = career.location.toLowerCase();
      return location.includes("nairobi") || location.includes("kenya") || location.includes("remote");
    });
    return {
      text: regionalRoles.length
        ? "Here are roles that fit Nairobi, Kenya, or broader East Africa access."
        : "I could not find location-specific roles for that region right now.",
      matches: regionalRoles
    };
  }

  const mentionedTeam = ["operations", "engineering", "customer", "success", "support"].find((team) =>
    query.includes(team)
  );
  if (mentionedTeam) {
    const teamRoles = roles.filter((career) => {
      const haystack = `${career.team} ${career.title} ${career.description}`.toLowerCase();
      return haystack.includes(mentionedTeam);
    });
    return {
      text: teamRoles.length
        ? `These are the best current matches for ${mentionedTeam} work.`
        : `I do not see a live opening for ${mentionedTeam} right now.`,
      matches: teamRoles
    };
  }

  if (query.includes("best") || query.includes("top")) {
    return {
      text: "These are the strongest highlighted openings based on the current marketplace list.",
      matches: roles.slice(0, 3)
    };
  }

  if (query.includes("available") || query.includes("open") || query.includes("jobs") || query.includes("roles")) {
    return {
      text: `There are ${roles.length} open roles in the careers hub right now.`,
      matches: roles.slice(0, 3)
    };
  }

  const matches = topMatches(roles, query, 3);
  if (matches.length > 0) {
    return {
      text: `I found ${matches.length} strong match${matches.length > 1 ? "es" : ""} for "${input}".`,
      matches
    };
  }

  return {
    text: `I could not find a direct match for "${input}". Try asking about remote roles, full-time jobs, applying, premium fast hiring, Nairobi openings, or a specific team.`,
    matches: []
  };
}

function JobsChatbot({ careers, premiumFee = "$29", employerUrl }) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      text: "I am the jobs assistant. Ask me about available jobs, teams, locations, application strategy, or premium fast hiring."
    }
  ]);

  const quickPrompts = useMemo(
    () => ["Available jobs", "Remote roles", "How do I apply?", "Premium fast hire"],
    []
  );

  function submitPrompt(event, promptText = input) {
    if (event) {
      event.preventDefault();
    }

    const normalized = promptText.trim();
    if (!normalized) {
      return;
    }

    const reply = buildReply(normalized, careers, premiumFee);
    setConversation((current) => [
      ...current,
      { role: "user", text: normalized },
      { role: "assistant", text: reply.text, matches: reply.matches }
    ]);
    setInput("");
    setIsOpen(true);
  }

  return (
    <div className={`floating-chatbot ${isOpen ? "open" : ""}`}>
      {isOpen ? (
        <section className="jobs-chatbot jobs-chatbot-floating">
          <div className="jobs-chatbot-head">
            <div>
              <p className="eyebrow">Jobs Assistant</p>
              <h3>Career help, live from the bottom corner</h3>
            </div>
            <button type="button" className="chat-close" onClick={() => setIsOpen(false)}>
              Close
            </button>
          </div>

          <div className="jobs-quick-prompts">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="quick-prompt"
                onClick={() => submitPrompt(null, prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="jobs-chat-window">
            {conversation.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={`chat-message chat-message-${message.role}`}
              >
                <strong>{message.role === "assistant" ? "Jobs Bot" : "You"}</strong>
                <p>{message.text}</p>
                {message.matches?.length ? (
                  <div className="chat-matches">
                    {message.matches.slice(0, 3).map((career) => (
                      <a
                        key={career.id}
                        href={career.apply_url || employerUrl || "#careers"}
                        target={career.apply_url || employerUrl ? "_blank" : undefined}
                        rel={career.apply_url || employerUrl ? "noreferrer" : undefined}
                        className="chat-match-card"
                      >
                        <span>{career.team}</span>
                        <strong>{career.title}</strong>
                        <small>{career.location} - {career.type}</small>
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <form className="jobs-chat-form" onSubmit={submitPrompt}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about open jobs, teams, locations, or fast hiring"
            />
            <button type="submit" className="button primary">Ask</button>
          </form>
        </section>
      ) : null}

      <button type="button" className="chat-launcher" onClick={() => setIsOpen(true)}>
        Jobs Chat
      </button>
    </div>
  );
}

export default JobsChatbot;
