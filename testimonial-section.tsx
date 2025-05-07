"use client"
import { Card, CardContent, Typography, Grid, Avatar, Box, ThemeProvider, createTheme } from "@mui/material"

// Create a dark theme to match the image
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
})

const testimonials = [
  {
    name: "John Doe",
    role: "Full Stack Developer",
    quote:
      '"The next-saas-stripe-starter repo has truly revolutionized my development workflow. With its comprehensive features and seamless integration with Stripe, I\'ve been able to build and deploy projects faster than ever before. The documentation is clear and concise, making it easy to navigate through the setup process. I highly recommend next-saas-stripe-starter to any developer."',
    image: "https://via.placeholder.com/100",
  },
  {
    name: "David Johnson",
    role: "DevOps Engineer",
    quote:
      '"Thanks to next-saas-stripe-starter, I was able to streamline the entire process and get payments up and running in no time."',
    image: "https://via.placeholder.com/100",
  },
  {
    name: "Emily Brown",
    role: "Marketing Manager",
    quote:
      '"next-saas-stripe-starter has been an invaluable asset in my role as a marketing manager. With its seamless integration with Stripe, I\'ve been able to launch targeted marketing campaigns with built-in payment functionality, allowing us to monetize our products and services more effectively."',
    image: "https://via.placeholder.com/100",
  },
  {
    name: "Michael Wilson",
    role: "Project Manager",
    quote:
      '"I\'m impressed by the quality of code and clear documentation of next-saas-stripe-starter. Kudos to the team!"',
    image: "https://via.placeholder.com/100",
  },
  {
    name: "Sophia Garcia",
    role: "Data Analyst",
    quote:
      '"next-saas-stripe-starter provided me with the tools I needed to efficiently manage user data. Thank you so much!"',
    image: "https://via.placeholder.com/100",
  },
  {
    name: "Jason Stan",
    role: "Web Designer",
    quote:
      '"Thanks to next-saas-stripe-starter, I\'ve been able to create modern and attractive user interfaces in record time. The starter kit provides a solid foundation for building sleek and intuitive designs, allowing me to focus more on the creative aspects of my work."',
    image: "https://via.placeholder.com/100",
  },
]

const TestimonialSection = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          bgcolor: "background.default",
          padding: 4,
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            alignItems: "flex-start",
          }}
        >
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  boxShadow: "none",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Avatar
                      alt={testimonial.name}
                      src={testimonial.image}
                      sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                        border: "2px solid rgba(255, 255, 255, 0.2)",
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6,
                      fontSize: "0.9rem",
                    }}
                  >
                    {testimonial.quote}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  )
}

export default TestimonialSection
