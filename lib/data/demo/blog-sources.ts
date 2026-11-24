/** Primary references consulted on 2026-11-06. Links are not expert endorsements. */
export interface BlogSource {
  label: string;
  url: string;
}
const training = {
  label: "AVSAB: humane dog training position statements",
  url: "https://avsab.org/resources/position-statements/",
};
const choosing = {
  label: "AVMA: selecting a pet dog and planning lifetime care",
  url: "https://avma.org/resources/pet-owners/petcare/selecting-pet-dog",
};
const breathing = {
  label: "AVMA: short-nosed dogs and respiratory risks",
  url: "https://avma.org/public/PetCare/Pages/Short-nosed-Dogs-and-Air-Travel-FAQs.aspx",
};
const children = {
  label: "AVMA: preventing dog bites and supervising children",
  url: "https://avma.org/resources-tools/pet-owners/dog-bite-prevention",
};
const eic = {
  label: "UC Davis Veterinary Genetics Laboratory: exercise-induced collapse",
  url: "https://vgl.ucdavis.edu/test/exercise-induced-collapse",
};
export const BLOG_SOURCES: Record<string, BlogSource[]> = {
  "german-shepherd-stubborn": [training],
  "french-bulldog-breathing-loud-boa": [
    breathing,
    {
      label: "American College of Veterinary Surgeons: brachycephalic syndrome",
      url: "https://www.acvs.org/small-animal/brachycephalic-syndrome/",
    },
  ],
  "french-bulldog-puppy-cost": [choosing, breathing],
  "labrador-puppy-cost": [choosing, eic],
  "labrador-vs-golden-retriever": [
    children,
    {
      label: "American Kennel Club: Labrador and Golden Retriever comparison",
      url: "https://www.akc.org/expert-advice/dog-breeds/golden-retriever-vs-labrador-retriever/",
    },
  ],
  "japanese-names-german-shepherd-female": [
    {
      label:
        "Japan Foundation Irodori: Japanese pitch accent learning resource (not a personal-name dictionary)",
      url: "https://www.irodori.jpf.go.jp/assets/data/wordlist_X.pdf",
    },
    training,
  ],
  "top-20-names-french-bulldog": [training],
  "labrador-pulls-on-leash": [training],
  "reputable-german-shepherd-breeder": [
    children,
    training,
    {
      label: "Cornell University: selecting a purebred puppy",
      url: "https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-topics/selecting-purebred-puppy",
    },
  ],
};

BLOG_SOURCES["license-to-breed-dogs-california-ab-702"] = [
  {
    label:
      "California Assembly Business and Professions: 2021–2022 legislative summary, AB 702 historical status",
    url: "https://abp.assembly.ca.gov/sites/abp.assembly.ca.gov/files/publications/2021-22%20Legislative%20Bill%20Summary%20%28ABP%29.pdf",
  },
  {
    label:
      "City of Los Angeles Animal Services: permits and breeding permit moratorium",
    url: "https://www.laanimalservices.com/permits",
  },
  {
    label:
      "USDA APHIS: Animal Welfare Act licensing and registration assessment",
    url: "https://www.aphis.usda.gov/awa/apply",
  },
  {
    label: "USDA APHIS: licensing and registration guidance",
    url: "https://www.aphis.usda.gov/animal_welfare/downloads/graybook.pdf",
  },
];

BLOG_SOURCES["8-weeks-rule-puppy"] = [
  {
    label:
      "Los Angeles County District Attorney: California animal cruelty law, PC 597z summary",
    url: "https://da.lacounty.gov/sites/default/files/pdf/ANIMAL_CRUELTY_ENG.pdf",
  },
  {
    label:
      "California Legislature: SB 914, chaptered in 2005, historical text establishing PC 597z",
    url: "https://leginfo.ca.gov/pub/05-06/bill/sen/sb_0901-0950/sb_914_bill_20051007_chaptered.html",
  },
  {
    label:
      "California Legislative Information: current PC 597z lookup, unavailable during editorial review",
    url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=597z.",
  },
];

BLOG_SOURCES["mdr1-australian-shepherd"] = [
  {
    label: "Cornell University: Drug sensitivity — MDR1",
    url: "https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/health-info/drug-sensitivity-mdr1",
  },
  {
    label: "Washington State University: MDR1 testing",
    url: "https://waddl.vetmed.wsu.edu/mdr1/",
  },
  {
    label: "Cornell University: Emergency and critical care",
    url: "https://www.vet.cornell.edu/hospitals/services/emergency-and-critical-care-0",
  },
];

BLOG_SOURCES["brucellosis-in-dogs"] = [
  {
    label: "CDC: Veterinary guidance for brucellosis",
    url: "https://www.cdc.gov/brucellosis/hcp/animals/",
  },
  {
    label: "CDC: Brucellosis and animals",
    url: "https://www.cdc.gov/brucellosis/php/animal-health/index.html",
  },
  {
    label: "Cornell University: Brucella Multiplex testing for dogs",
    url: "https://www.vet.cornell.edu/animal-health-diagnostic-center/testing/testing-protocols-interpretations/brucella-multiplex-testing-dogs",
  },
];

BLOG_SOURCES["eic-in-labrador"] = [
  {
    label: "UC Davis Veterinary Genetics Laboratory: Exercise-induced collapse",
    url: "https://vgl.ucdavis.edu/test/exercise-induced-collapse",
  },
  {
    label: "University of Minnesota: DNM1-associated exercise-induced collapse",
    url: "https://canine-genetics.umn.edu/canine-genetic-testing/dynamin-1-associated-exercise-induced-collapse",
  },
  {
    label: "Cornell University: Emergency and critical care",
    url: "https://www.vet.cornell.edu/hospitals/services/emergency-and-critical-care-0",
  },
];

BLOG_SOURCES["best-food-french-bulldog"] = [
  {
    label: "FDA: Complete and balanced pet food",
    url: "https://www.fda.gov/animal-veterinary/animal-health-literacy/complete-and-balanced-pet-food",
  },
  {
    label: "WSAVA: Guidelines on selecting pet foods",
    url: "https://wsava.org/wp-content/uploads/2021/04/Selecting-a-pet-food-for-your-pet-updated-2021_WSAVA-Global-Nutrition-Toolkit.pdf",
  },
  {
    label: "CDC: About pet food safety",
    url: "https://www.cdc.gov/healthy-pets/about/pet-food-safety.html",
  },
];
