const pdf = require("pdf-parse");

const pdfPrase = async (pdfBuffer) => {
  try {
    const data = await pdf(pdfBuffer);
    const text = data.text;
    const extractedData = extractCVData(text);
    return extractedData;
  } catch (error) {
    console.error("PDF parsing error:", error.message);
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

// // Helper function to join lines for each education item
// function parseEducation(lines) {
//   const items = [];
//   // This simple example assumes every two lines form one education item.
//   for (let i = 0; i < lines.length; i += 3) {
//     // Combine degree, institution, and dates/location
//     const item = lines.slice(i, i + 3).join(" ");
//     if (item.trim()) items.push(item.trim());
//   }
//   return items;
// }

// // Similar helper for qualifications (from key achievements)
// function parseQualifications(lines) {
//   const items = [];
//   // Assuming each achievement spans two lines (title and description)
//   for (let i = 0; i < lines.length; i += 2) {
//     const item = lines.slice(i, i + 2).join(" ");
//     if (item.trim()) items.push(item.trim());
//   }
//   return items;
// }

// // Helper for projects (including GitHub links)
// function parseProjects(lines) {
//   const items = [];
//   // This example assumes each project takes three lines: title, description, and link.
//   for (let i = 0; i < lines.length; i += 3) {
//     const title = lines[i] || "";
//     const description = lines[i + 1] || "";
//     const link = lines[i + 2] ? `GitHub: ${lines[i + 2]}` : "";
//     const item = [title, description, link].filter(Boolean).join(" ");
//     if (item.trim()) items.push(item.trim());
//   }
//   return items;
// }

// function extractCVData(text) {
//   // Split text into lines and remove extra whitespace
//   const lines = text
//     .split("\n")
//     .map((line) => line.trim())
//     .filter(Boolean);

//   // Create our JSON object with default empty values
//   const cvData = {
//     name: "",
//     education: [],
//     qualifications: [],
//     projects: [],
//   };

//   // Assuming the name is the second line in the CV
//   cvData.name = lines[1];

//   // Identify the indices for the key sections
//   const eduIndex = lines.indexOf("EDUCATION");
//   const projIndex = lines.indexOf("PROJECTS");
//   const qualIndex = lines.indexOf("QUALIFICATIONS");

//   // Extract Education block: from EDUCATION to next section (here, PROJECTS)
//   if (eduIndex !== -1) {
//     // If PROJECTS comes after EDUCATION, use its index; otherwise, until the end of the array
//     const eduEnd = projIndex !== -1 ? projIndex : lines.length;
//     // Remove the header 'EDUCATION'
//     const educationLines = lines.slice(eduIndex + 1, eduEnd);
//     cvData.education = parseEducation(educationLines);
//   }

//   // Extract Projects block: from PROJECTS to KEY ACHIEVEMENTS (or end if KEY ACHIEVEMENTS doesn't exist)
//   if (projIndex !== -1) {
//     const projEnd = qualIndex !== -1 ? qualIndex : lines.length;
//     const projectLines = lines.slice(projIndex + 1, projEnd);
//     cvData.projects = parseProjects(projectLines);
//   }

//   // Extract Qualifications from KEY ACHIEVEMENTS section until the next header or end of text
//   if (qualIndex !== -1) {
//     const qualEnd =
//       lines.indexOf("SKILLS") !== -1 ? lines.indexOf("SKILLS") : lines.length;
//     const qualificationLines = lines.slice(qualIndex + 1, qualEnd);
//     cvData.qualifications = parseQualifications(qualificationLines);
//   }

//   return cvData;
// }

// Heuristic function to extract a candidate name from the first few lines.
// It looks for a line that’s all (or mostly) uppercase and has at least two words.
function extractName(lines) {
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (
      line.length > 3 &&
      line.split(" ").length > 1 &&
      line === line.toUpperCase()
    ) {
      return line;
    }
  }
  return "";
}

// A generic function to extract a section from the CV text.
// It looks for a header that matches one of the provided keywords (case-insensitive)
// and returns all lines until the next header-like line.
function extractSection(lines, headerVariants) {
  const headerSet = headerVariants.map((h) => h.toUpperCase());
  let startIndex = -1;
  let endIndex = lines.length;
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i].trim();
    // Check if the current line contains one of our header keywords.
    if (
      headerSet.some((header) => currentLine.toUpperCase().includes(header))
    ) {
      startIndex = i;
      break;
    }
  }
  if (startIndex === -1) return [];
  // Look ahead for the next potential header (heuristic: a short line that is all uppercase)
  for (let j = startIndex + 1; j < lines.length; j++) {
    const line = lines[j].trim();
    if (
      line.length > 0 &&
      line === line.toUpperCase() &&
      line.length < 30 &&
      !headerSet.some((header) => line.includes(header))
    ) {
      // If we detect a header-like line that isn’t just a continuation of our section,
      // we assume the current section ends before this line.
      endIndex = j;
      break;
    }
  }
  return lines.slice(startIndex + 1, endIndex);
}

// A heuristic parser for the Education section.
// This function tries to group consecutive lines into individual education entries.
// It uses a simple check for numeric patterns (dates) as a cue.
function parseEducation(educationLines) {
  const entries = [];
  let currentEntry = [];
  educationLines.forEach((line) => {
    // Look for a date or year pattern (e.g. "01/2012", "2013") which may indicate a new entry.
    if (/\d{2,4}/.test(line) && currentEntry.length) {
      entries.push(currentEntry.join(" "));
      currentEntry = [line];
    } else {
      currentEntry.push(line);
    }
  });
  if (currentEntry.length) {
    entries.push(currentEntry.join(" "));
  }
  return entries;
}

// A heuristic parser for the Qualifications/Key Achievements section.
// This function groups lines, starting a new entry when a line is fully uppercase and short.
function parseQualifications(qualificationLines) {
  const entries = [];
  let currentEntry = [];
  qualificationLines.forEach((line) => {
    // If a line looks like a header (all uppercase and short), it might indicate a new achievement.
    if (
      line === line.toUpperCase() &&
      line.length < 50 &&
      currentEntry.length
    ) {
      entries.push(currentEntry.join(" "));
      currentEntry = [line];
    } else {
      currentEntry.push(line);
    }
  });
  if (currentEntry.length) {
    entries.push(currentEntry.join(" "));
  }
  return entries;
}

// A heuristic parser for the Projects section.
// This version looks for GitHub links to mark the end of a project entry.
// If no link is found, it groups lines until a break.
function parseProjects(projectLines) {
  const entries = [];
  let currentEntry = [];
  projectLines.forEach((line) => {
    // If we detect a GitHub link, assume this completes the current project entry.
    if (line.toLowerCase().includes("github.com")) {
      currentEntry.push(`GitHub: ${line}`);
      entries.push(currentEntry.join(" "));
      currentEntry = [];
    } else {
      currentEntry.push(line);
    }
  });
  if (currentEntry.length) {
    entries.push(currentEntry.join(" "));
  }
  return entries;
}

// Main function to extract CV data into our JSON structure.
function extractCVData(text) {
  // Split text into lines and trim any extra whitespace.
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Initialize the JSON object with empty values.
  const cvData = {
    name: "",
    education: [],
    qualifications: [],
    projects: [],
  };

  // Extract the name using the heuristic.
  cvData.name = extractName(lines);

  // Use dynamic section extraction with possible header variants.
  const educationSection = extractSection(lines, [
    "EDUCATION",
    "EDUCATION & TRAINING",
  ]);
  if (educationSection.length) {
    cvData.education = parseEducation(educationSection);
  }

  const qualificationsSection = extractSection(lines, [
    "KEY ACHIEVEMENTS",
    "ACHIEVEMENTS",
    "ACCOMPLISHMENTS",
  ]);
  if (qualificationsSection.length) {
    cvData.qualifications = parseQualifications(qualificationsSection);
  }

  const projectsSection = extractSection(lines, ["PROJECTS"]);
  if (projectsSection.length) {
    cvData.projects = parseProjects(projectsSection);
  }

  return cvData;
}

module.exports = { pdfPrase };
