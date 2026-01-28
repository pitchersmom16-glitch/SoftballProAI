import { getUncachableStripeClient } from '../server/stripeClient';

async function createProducts() {
  const stripe = await getUncachableStripeClient();

  console.log('Creating SoftballProAI subscription products...');

  const basicProduct = await stripe.products.create({
    name: 'Basic Plan',
    description: 'Essential AI biomechanics analysis for individual players',
    metadata: {
      tier: 'basic',
      features: 'Video analysis, Goal tracking, Basic drills'
    }
  });

  await stripe.prices.create({
    product: basicProduct.id,
    unit_amount: 1499,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { tier: 'basic' }
  });

  console.log('Created Basic Plan:', basicProduct.id);

  const eliteProduct = await stripe.products.create({
    name: 'Elite Plan',
    description: 'Advanced AI coaching with personalized training roadmaps',
    metadata: {
      tier: 'elite',
      features: 'All Basic features, AI Training Roadmap, GameChanger integration, Recruiting profile'
    }
  });

  await stripe.prices.create({
    product: eliteProduct.id,
    unit_amount: 2999,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { tier: 'elite' }
  });

  console.log('Created Elite Plan:', eliteProduct.id);

  const coachProduct = await stripe.products.create({
    name: 'Coach Plan',
    description: 'Full team management and remote coaching platform',
    metadata: {
      tier: 'coach',
      features: 'All Elite features, Team roster management, Practice architect, Student lesson roster'
    }
  });

  await stripe.prices.create({
    product: coachProduct.id,
    unit_amount: 9900,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { tier: 'coach' }
  });

  console.log('Created Coach Plan:', coachProduct.id);

  console.log('\nCreating coupon codes...');

  await stripe.coupons.create({
    id: 'DONOR100',
    percent_off: 100,
    duration: 'forever',
    name: 'Founding Member - GoFundMe Donor',
    metadata: { badge: 'founding_member' }
  });

  console.log('Created DONOR100 coupon (100% off forever)');

  await stripe.coupons.create({
    id: 'FRIEND50',
    percent_off: 50,
    duration: 'forever',
    name: 'Friend of SoftballProAI - 50% Off',
    metadata: { badge: 'friend' }
  });

  console.log('Created FRIEND50 coupon (50% off forever)');

  console.log('\nAll products and coupons created successfully!');
}

createProducts().catch(console.error);
