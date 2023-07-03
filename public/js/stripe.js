import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51LtQWFAIZvCw2GZwqYBrnJ85hiv0SkqfSq8Hd89TcVMOQewvx5GmSAQ3KhvoTbp3EqgwzkKtshLuTRhNsEU1OSxY00YgG4RK5U'
);
export const bookTour = async (tourID) => {
  try {
    // get session from server from api
    const session = await axios(`/api/v1/bookings/checkout-session/${tourID}`);
    // auto create checkout form plus charge crdit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
