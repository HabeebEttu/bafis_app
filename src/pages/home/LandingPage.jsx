import React from 'react'
import { FaEarlybirds, FaMotorcycle } from "react-icons/fa"
import "./LandingPage.css"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { IoPlayCircle, IoStatsChart } from "react-icons/io5";
import { keyframes } from '@emotion/react';
import Card from '@mui/material/Card';
import { CgDropOpacity } from 'react-icons/cg'
import { MdOutlineMail } from "react-icons/md";
import { FaGlobeAsia } from "react-icons/fa";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
export default function LandingPage() {
 
  return (
    <div style={{
        backgroundColor:'#fdfdfdff'
      }}>
      <Navbar />
      <Hero />
      <Features />
      <Footer/>
    </div>
  )
}
function Navbar() {
    return (
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        px={3}
        py={1}
        bgcolor={"white"}
        boxShadow={1}
        borderBottom={0}
      >
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={3}
        >
          <Box
              sx={{
              color: "primary.main",
                fontWeight:600
            }}
            display={'flex'}
            flexDirection={'row'}
            alignItems={'center'}
            gap={2}
          >
            
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                py: 1,
                px: 1.5,
                borderRadius: 1,
              }}
            >
              <FaMotorcycle />
            </Box>
            BAFIS
          </Box>
        </Box>
        <Box
        display={'flex'}

        gap={1}
        >
          <Link to={'/login'}>
          <Button
            variant='outlined'
            size='small'
          >Sign In</Button></Link>
          <Button
          variant='contained'
          >Get Started</Button>
        </Box>
      </Box>
    ); 
}
function Hero() {
   const ping = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
`;
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  return (
    <Container
      maxWidth="lg"
      sx={{
        position: "relative",
      }}
    >
      

      <Box sx={{ textAlign: "center", py: 10 }}>
        <Chip
          label="New: AI-Driven Mortality Prediction"
          sx={{ mb: 3, bgcolor: "success.light", color: "success.main" }}
        />

        <Typography variant="h2" fontWeight={800} textAlign={"center"}>
          Empowering{" "}
          <Box component="span" color="primary.main">
            Precision
            <br />
          </Box>{" "}
          Poultry Management
        </Typography>

        <Typography
          sx={{ mt: 2, color: "text.secondary", maxWidth: 700, mx: "auto" }}
        >
          The all-in-one suite designed for modern poultry farmers. Track every
          bird, optimize feed consumption, and maximize profitability.
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button size={
            isDesktop?'large':'small'
          } variant="contained" >
            Get Started Free →
          </Button>
          <Button size="large" variant="outlined">
            <IoPlayCircle size={25} />
            Watch Demo
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
function Features() {
  const features = [
    {
      icon: FaEarlybirds,
      title: "precision flock training",
      body: "Monitor bird batches, daily mortality rates and growth velocity across multiple pens in real time.",
    },
    {
      icon: CgDropOpacity,
      title: "smart feed optimizer",
      body: "Automated inventory tracking and consumption analysis to ensure optimal nutrient delivery and reduce waste.",
    },
    {
      icon: IoStatsChart,
      title: "Advanced Analytics",
      body:"Visual data reports and FCR(Feed Conversion Ratio) calculation to drive intelligent farm decisions."
    },
  ];
  return (
   <Container maxWidth={'lg'}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        width={'100%'}
        mb={5}

      >
        <Typography variant='h6' sx={{
          color: 'secondary.main',
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing:1
          
        }}>Key Features</Typography>
        <Typography
          variant='h1'
          sx={{
            fontSize: 32,
            fontWeight: 700,
            marginTop: 3
          }}
        >
          Built for Total Visibility
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3,1fr)',
              lg:'repeat(3,1fr)'
            },
            rowGap:5,
            columnGap: 5,
            width: '100%',
            mt: 3
          }
          }
        >
          {
            features.map((feature, _) => <FeaturesCard key={feature} Icon={feature.icon} title={feature.title} body={ feature.body} />)
         }
        </Box>

</Box>
   </Container>
  )
}
function FeaturesCard({Icon, title,body}) {
  return (
    <Card variant="outlined" elevation={0}>
      <Box
        p={4}
        display={"flex"}
        alignItems={"start"}
        justifyContent={"start"}
        flexDirection={'column'}
        gap={4}
        rowGap={4}
        gridColumn={4}
        maxWidth={'100%'}
      >
        <Box
          sx={{
            bgcolor: "grey.300",
            color: "primary.main",
            py: 1,
            px: 1.5,
            borderRadius: 1,
          }}
        >
          <Icon />
        </Box>
        <Typography variant='h2' sx={{ fontWeight: 700, fontSize: 20 ,textWrap:'nowrap'}} color='black'
          textTransform={'capitalize'} 
        >
          {title}
        </Typography>
        <Typography variant='body1'>
          {body}
        </Typography>
      </Box>
    </Card>
  );
}
function Footer() {
  
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Box
      maxWidth={"100%"}
      bgcolor={'white'}
      sx={{
        display: "grid",
        rowGap:4,
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(1,1fr)",
          lg: "repeat(4,1fr)",
        },
        px: isDesktop ? 10 : 4,
        py:5
      }}
    >
      <Box
        display={"flex"}
        alignItems={"start"}
        gap={4}
        flexDirection={"column"}
        pr={4}
      >
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              py: 1,
              px: 1.5,
              borderRadius: 1,
            }}
          >
            <FaMotorcycle />
          </Box>
          <Typography
            textTransform={"uppercase"}
            color="primary.main"
            fontWeight={600}
          >
            bafis
          </Typography>
        </Box>
        <Typography fontSize={15}>
          Leading the feature of poultry management through innovative data and
          farmer first designs.
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              color: "grey.300",
              borderRadius: 1,
              border: "0.75px solid #D1D5DB",
              py: 0.8,
              px: 1,
            }}
            height={"fit-content"}
          >
            <FaGlobeAsia />
          </Box>
          <Box
            sx={{
              bgcolor: "white",
              color: "grey.300",
              borderRadius: 1,
              border: "0.75px solid #D1D5DB",
              py: 0.8,
              px: 1,
            }}
            height={"fit-content"}
          >
            <MdOutlineMail />
          </Box>
        </Box>
      </Box>
      <Box
        display={"flex"}
        alignItems={"start"}
        gap={2}
        flexDirection={"column"}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: 17,
          }}
        >
          Product
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          Features
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          Integration
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          Enterprise
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          Solution
        </Typography>
      </Box>
      <Box
        display={"flex"}
        alignItems={"start"}
        gap={2}
        flexDirection={"column"}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: 17,
          }}
        >
          Resources
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          Documentation
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          Blog
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          Api Reference
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          Community
        </Typography>
      </Box>
      <Box
        display={"flex"}
        alignItems={"start"}
        gap={2}
        flexDirection={"column"}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: 17,
          }}
        >
          Company
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          About Us
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          Contact
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          Privacy
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          Terms
        </Typography>
      </Box>
    </Box>
  ); 
}