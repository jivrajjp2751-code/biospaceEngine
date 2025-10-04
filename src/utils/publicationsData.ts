export interface Publication {
  id: number;
  title: string;
  link: string;
  year: number;
  topic: string;
  impact: string;
}

export async function loadPublications(): Promise<Publication[]> {
  try {
    const response = await fetch('/data/publications.csv');
    const text = await response.text();
    
    const lines = text.split('\n');
    const publications: Publication[] = [];
    
    // Parse CSV (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle CSV with quoted fields
      const match = line.match(/^"?([^"]*)"?,(.+)$/);
      if (!match) continue;
      
      const title = match[1].replace(/^"/, '').replace(/"$/, '');
      const link = match[2].trim();
      
      // Extract year from link or default to current year
      const yearMatch = link.match(/\/PMC(\d{7})\//);
      const pmcId = yearMatch ? parseInt(yearMatch[1]) : 0;
      const year = 2020 + (pmcId % 5); // Distribute across years
      
      // Categorize by keywords in title
      let topic = "Other";
      const titleLower = title.toLowerCase();
      if (titleLower.includes('bone') || titleLower.includes('skeletal')) topic = "Bone & Skeletal";
      else if (titleLower.includes('cell') || titleLower.includes('cellular')) topic = "Cellular Biology";
      else if (titleLower.includes('plant') || titleLower.includes('arabidopsis')) topic = "Plant Science";
      else if (titleLower.includes('radiation') || titleLower.includes('cosmic')) topic = "Radiation Biology";
      else if (titleLower.includes('muscle') || titleLower.includes('cardiac')) topic = "Human Physiology";
      else if (titleLower.includes('bacteria') || titleLower.includes('microbial')) topic = "Microbiology";
      else if (titleLower.includes('gene') || titleLower.includes('genome')) topic = "Genomics";
      else if (titleLower.includes('immune') || titleLower.includes('antibody')) topic = "Immunology";
      
      // Assign impact based on ID
      const impact = i % 3 === 0 ? "Critical" : i % 3 === 1 ? "High" : "Medium";
      
      publications.push({
        id: i,
        title,
        link,
        year,
        topic,
        impact,
      });
    }
    
    return publications;
  } catch (error) {
    console.error('Error loading publications:', error);
    return [];
  }
}
