import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const morningMeal = await prisma.meal.create({
    data: {
      name: 'Pancakes aux myrtilles avec yogourt grec et noix',
      ingredients: [
        "100g de farine d'avoine",
        "1 cuillère à café de levure chimique",
        "1 cuillère à café de cannelle",
        "1 cuillère à soupe de sirop d'érable",
        "200ml de lait d'amande",
        "1 cuillère à soupe d'huile de coco",
        "75g de myrtilles",
        "150g de yogourt grec",
        "30g de noix hachées",
      ],
      steps: [
        'Mélanger la farine d\'avoine, la levure chimique et la cannelle dans un bol.',
        'Ajouter le sirop d\'érable et le lait d\'amande, mélanger jusqu\'à obtenir une pâte lisse.',
        'Chauffer l\'huile de coco dans une poêle à feu moyen.',
        'Verser environ un quart de la pâte pour chaque pancake et disperser quelques myrtilles sur le dessus.',
        'Cuire jusqu\'à ce que des bulles apparaissent sur la surface, puis retourner pour cuire de l\'autre côté.',
        'Servir les pancakes chauds avec une portion de yogourt grec et garnir de noix hachées.',
      ],
      nutrition: {
        create: {
          calories: 510,
          protein: '22g',
          carbohydrates: '75g',
          fat: '18g',
        },
      },
    },
  });

  const afternoonMeal = await prisma.meal.create({
    data: {
      name: 'Salade de poulet grillé',
      ingredients: [
        '150g de poitrine de poulet grillée',
        '2 tasses de laitue romaine',
        '1/2 avocat',
        '10 tomates cerises',
        '1 cuillère à soupe de vinaigrette balsamique',
      ],
      steps: [
        'Griller la poitrine de poulet jusqu\'à ce qu\'elle soit bien cuite.',
        'Couper le poulet, l\'avocat, et les tomates cerises.',
        'Mélanger la laitue avec les autres ingrédients.',
        'Assaisonner avec la vinaigrette balsamique et servir.',
      ],
      nutrition: {
        create: {
          calories: 500,
          protein: '30g',
          carbohydrates: '20g',
          fat: '30g',
        },
      },
    },
  });

  const eveningMeal = await prisma.meal.create({
    data: {
      name: 'Poulet rôti avec légumes',
      ingredients: [
        '200g de poulet rôti',
        '1 tasse de brocoli',
        '1 carotte',
        '1 cuillère à soupe d\'huile d\'olive',
        'Sel et poivre',
      ],
      steps: [
        'Préchauffer le four à 200°C.',
        'Assaisonner le poulet avec du sel et du poivre.',
        'Rôtir le poulet au four pendant 25 minutes.',
        'Faire cuire les légumes à la vapeur pendant 10 minutes.',
        'Servir le poulet avec les légumes.',
      ],
      nutrition: {
        create: {
          calories: 600,
          protein: '40g',
          carbohydrates: '30g',
          fat: '25g',
        },
      },
    },
  });

  // Create default meal plans
  await prisma.mealPlan.createMany({
    data: [
      {
        day: new Date('2024-09-25'),
        morningMealId: morningMeal.id,
        afternoonMealId: afternoonMeal.id,
        eveningMealId: eveningMeal.id,
        isDefault: true,
      },
      {
        day: new Date('2024-09-26'),
        morningMealId: morningMeal.id, 
        afternoonMealId: afternoonMeal.id,
        eveningMealId: eveningMeal.id,
        isDefault: true,
      },
    ],
  });

  console.log('Default meal plans created!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
