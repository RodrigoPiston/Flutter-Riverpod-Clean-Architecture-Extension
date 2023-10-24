
export function toTitleCase(str: string): string {
    return str
      .split("_") // Handle snake_case
      .map((word) =>
        word
          .split("-") // Handle kebab-case
          .map((subWord) =>
            subWord
              .split(" ") // Handle space separated words
              .map(
                (part) =>
                  part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
              )
              .join(" ")
          )
          .join("-")
      )
      .join("");
  }