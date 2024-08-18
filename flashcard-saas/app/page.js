

import getStripe from "./utils/get-stripe";
import Image from "next/image";
import { Container } from "@mui/material";
import {SignedIn, SignedOut, UserButton, } from '@clerk/nextjs';

    
    



export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }
  return (
    <main className="h-full w-full">
      <div className="w-full p-2">
        <div className="carousel rounded-box ">
          <div className="carousel-item">
            <img
              src="https://i.pinimg.com/564x/fc/97/53/fc975355779d07f94969d2688fbbc629.jpg"
              alt="Burger"
              className="w-80 h-80"
            />
          </div>
          <div className="carousel-item">
            <img
              className="w-84 h-80"
              src="https://www.ihna.edu.au/blog/wp-content/uploads/2018/01/1705-shutterstock_405482314.jpg"
              alt="Burger"
            />
          </div>
          <div className="carousel-item">
            <img
              className="w-88 h-80"
              src="https://mystudylife.com/wp-content/uploads/2022/09/pexels-pixabay-301920-scaled.jpg"
              alt="Burger"
            />
          </div>
          <div className="carousel-item">
            <img
              className="w-88 h-80"
              src="https://i.etsystatic.com/23728824/r/il/c2794b/2456006787/il_570xN.2456006787_3kir.jpg"
              alt="Burger"
            />
          </div>

          <div className="carousel-item">
            <img
              className="w-88 h-80"
              src="https://i.pinimg.com/736x/63/5d/16/635d16c6fee9440895db2f678404fc44.jpg"
              alt="Burger"
            />
          </div>
        </div>
      </div>
      <h1 className="text-center text-4xl p-2">
        Tired of studying for hours just to get nowhere?
      </h1>
      <h2 className="text-center text-white text-xl p-2">
        Our interactive, AI generated flashcards can help you study advanced
        topics in minutes! Copy paste your notes and your AI flashcards will be
        generated in seconds. Not sure if its for you? Just give it a try, it's
        free!
      </h2>
      <div className="w-full flex-row flex items-center justify-around">
        <div />
        <a href="./generate">
          <button className="btn btn-primary">Get started</button>
        </a>

        <div />
      </div>
    <Box sx={{my: 6, textAlign: 'center'}}>
      <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
      <Grid container spacing={4} justifyContent="center">
        {/* Pricing plans */}
      </Grid>
    </Box>
    </Container>
    </main>

  );
}


