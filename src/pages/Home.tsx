import { Button, Card, CardActions, CardContent, CardMedia, Container, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const universityImage = 'https://thumbs.dreamstime.com/b/university-campus-building-hall-education-students-cartoon-vector-illustration-brotherhood-smart-nerd-classes-hipster-young-155883208.jpg';
const subscribeImage = 'https://previews.123rf.com/images/iqoncept/iqoncept1811/iqoncept181100182/112560203-subscribe-cartoon-face-smile-subscription-now-3d-illustration.jpg';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ paddingTop: '24px', paddingBottom: '24px' }} >
      <Stack spacing={4} direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }} alignItems="center" justifyContent="center">
        <Card sx={{ maxWidth: '500px' }}>
          <CardMedia component="img" height="200" alt="University list image" image={universityImage} />
          <CardContent sx={{ textAlign: 'left' }}>
            <Typography gutterBottom variant="h5" component="div">University List</Typography>
            <Typography variant="body2" color="text.secondary">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => navigate('/list')}>Learn more</Button>
          </CardActions>
        </Card>
        <Card sx={{ maxWidth: '500px' }}>
          <CardMedia component="img" height="200" alt="Subscribe image" image={subscribeImage} />
          <CardContent sx={{ textAlign: 'left' }}>
            <Typography gutterBottom variant="h5" component="div">Subscribe</Typography>
            <Typography variant="body2" color="text.secondary">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => navigate('/subscribe')}>Learn more</Button>
          </CardActions>
        </Card>
      </Stack>
    </Container>
  );
};

export default Home;
