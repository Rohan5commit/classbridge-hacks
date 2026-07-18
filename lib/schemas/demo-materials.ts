export interface DemoWorksheet {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  difficulty: string;
  icon: string;
  color: string;
  content: string;
  description: string;
}

export const demoWorksheets: DemoWorksheet[] = [
  {
    id: "demo-photosynthesis",
    title: "Photosynthesis & Energy Transformation",
    subject: "Biology",
    gradeLevel: "Grade 8",
    difficulty: "Intermediate",
    icon: "🌱",
    color: "from-emerald-400 to-teal-500",
    content: `PHOTOSYNTHESIS WORKSHEET — Grade 8 Biology

Topic: How Plants Convert Light Energy into Chemical Energy

Instructions: Read the following passage and answer the questions below.

---

Passage:

Photosynthesis is the physicochemical process by which plants, algae, and certain bacteria utilize light energy to drive the synthesis of organic compounds. In plants, photosynthesis occurs primarily in the chloroplasts of mesophyll cells, which contain the photosynthetic pigment chlorophyll.

The overall equation for photosynthesis can be represented as:

6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂

This means that six molecules of carbon dioxide (CO₂) and six molecules of water (H₂O), in the presence of light energy, are converted into one molecule of glucose (C₆H₁₂O₆) and six molecules of oxygen (O₂).

Photosynthesis occurs in two main stages:

1. Light-Dependent Reactions (in the thylakoid membranes):
   - Light energy is absorbed by chlorophyll
   - Water molecules are split (photolysis) releasing oxygen
   - ATP and NADPH are produced as energy carriers

2. Calvin Cycle / Light-Independent Reactions (in the stroma):
   - CO₂ from the atmosphere is fixed into organic molecules
   - ATP and NADPH from the light reactions power the synthesis of glucose
   - This cycle is also called carbon fixation

Factors affecting photosynthesis include light intensity, CO₂ concentration, temperature, and water availability.

---

Questions:

1. What is the primary function of photosynthesis?
2. Where does photosynthesis occur inside a plant cell?
3. Write the balanced chemical equation for photosynthesis.
4. Explain the difference between light-dependent reactions and the Calvin Cycle.
5. What role does chlorophyll play in photosynthesis?
6. Name three factors that affect the rate of photosynthesis.
7. Why is photosynthesis important for life on Earth?
8. What happens to water molecules during the light-dependent reactions?`,
    description:
      "Explore how plants convert sunlight into food — from chlorophyll to the Calvin Cycle.",
  },
  {
    id: "demo-math",
    title: "Ratios & Proportional Reasoning",
    subject: "Mathematics",
    gradeLevel: "Grade 7",
    difficulty: "Intermediate",
    icon: "📐",
    color: "from-blue-400 to-indigo-500",
    content: `MATH WORD PROBLEMS — Grade 7 Mathematics

Topic: Ratios, Rates, and Proportional Relationships

Directions: Solve each problem. Show your work.

---

Problem 1: The Recipe Ratio

A recipe for lemonade calls for 3 cups of lemon juice for every 5 cups of water. If you want to make a large batch using 15 cups of water, how many cups of lemon juice do you need?

Problem 2: The Map Scale

A map has a scale of 1 inch = 25 miles. If the distance between two cities on the map is 4.5 inches, what is the actual distance between the cities?

Problem 3: Unit Rate Comparison

At Store A, 6 notebooks cost $8.40.
At Store B, 10 notebooks cost $13.50.

Which store offers the better deal? Explain your reasoning using unit rates.

Problem 4: Proportional Relationship

The relationship between the number of hours studied (h) and the score on a test (s) is proportional. If 3 hours of studying results in a score of 78, write an equation that represents this relationship. Then predict the score for 5 hours of studying.

Problem 5: Real-World Ratio

A car travels 288 miles on 12 gallons of gas. At this rate:
a) How many miles per gallon does the car get?
b) How far can the car travel on 15 gallons?
c) How many gallons are needed to travel 400 miles?

---

Key Vocabulary:
- Ratio: A comparison of two quantities
- Rate: A ratio with different units
- Unit Rate: A rate with a denominator of 1
- Proportional: Two quantities that maintain the same ratio
- Scale Factor: The ratio used to enlarge or reduce a figure`,
    description:
      "Master ratios and proportional reasoning with real-world word problems.",
  },
  {
    id: "demo-history",
    title: "The Age of Exploration",
    subject: "World History",
    gradeLevel: "Grade 9",
    difficulty: "Advanced",
    icon: "🗺️",
    color: "from-amber-400 to-orange-500",
    content: `HISTORY PARAGRAPH — Grade 9 World History

Topic: The Age of Exploration and Its Global Impact

---

Reading Passage:

Between the 15th and 17th centuries, European nations embarked on a period of extensive maritime exploration that fundamentally altered the geopolitical, economic, and cultural landscape of the world. Motivated by the desire to find direct sea routes to the lucrative spice markets of Asia, European powers — beginning with Portugal and Spain — dispatched expeditions across uncharted waters.

Prince Henry the Navigator of Portugal pioneered systematic exploration of the African coast in the early 1400s, establishing trading posts and advancing navigational techniques. In 1492, Christopher Columbus, sailing under the Spanish crown, reached the Americas — initiating a transformative and often devastating encounter between the Old World and the New World.

Vasco da Gama's successful voyage to India in 1498 established a direct sea route from Europe to Asia, disrupting the traditional overland Silk Road trade routes controlled by Ottoman and Venetian intermediaries. Ferdinand Magellan's expedition (1519–1522) achieved the first circumnavigation of the globe, conclusively demonstrating the spherical nature of the Earth and revealing the vast extent of the Pacific Ocean.

The consequences of these explorations were profound and multifaceted. The Columbian Exchange — the widespread transfer of plants, animals, culture, human populations, technology, and ideas between the Americas and the Old World — revolutionized agriculture, cuisine, and demographics on every continent. However, the Age of Exploration also initiated the transatlantic slave trade, European colonialism, and the decimation of Indigenous populations through violence, exploitation, and introduced diseases.

The mercantile economic system that emerged during this period laid the groundwork for modern capitalism, while the competition among European powers for overseas territories and trade routes became a primary driver of international conflict for centuries to come.

---

Questions:

1. What were the primary economic motivations behind European exploration?
2. Describe the significance of Vasco da Gama's voyage to India.
3. Explain the concept of the "Columbian Exchange" and provide three examples of what was exchanged.
4. What were two major negative consequences of the Age of Exploration for non-European peoples?
5. How did the Age of Exploration contribute to the development of modern capitalism?`,
    description:
      "Understand how European exploration reshaped the entire world — for better and for worse.",
  },
];

export function getDemoWorksheet(id: string): DemoWorksheet | undefined {
  return demoWorksheets.find((w) => w.id === id);
}
