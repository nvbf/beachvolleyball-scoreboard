import React from "react";
import Link from "next/link";
import { makeStyles } from '@material-ui/core/styles';
import {Card, CardMedia, CardTitle, CardContent, CardActionArea, Typography, Container, CardActions, Button} from "@material-ui/core";
import AppBarMain from "../src/components/components/appbar";

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: theme.spacing(2)
  }
}))
const ButtonLink = ({ className, href, hrefAs, children, prefetch }) => (
  <Link href={href} as={hrefAs} prefetch>
    <a className={className}>
      {children}
    </a>
  </Link>
)


export default () => {
  return (
      <div>
        <AppBarMain />
        <Container maxWidth='sm'>
          <ul>
            <li>Do you need an electronically beachvolleyball scoresheet? </li>
            <li>Do you want livescore on your game? </li>
            <li>
              Do you want the scoresheet to remember, switch, technical timeouts
              and everything else that is hard to remebmer?
            </li>
          </ul>
          <p>
            {" "}We offer you all of the above for free! You can also create a
            tournament with livescore{" "}
          </p>
          <p>
            {" "}PS: want to go hardcore and setup streaming also? see{" "}
            <a href="https://volleystream.no">Volleystream.no</a>{" "}
          </p>
        </Container>
        <main>
          <Container maxWidth='sm'>
            <FrontPageMenuItem title='New match'
                               description='Electronic score sheet, no need for an separate scorer.'
                               link='/match' />

            <FrontPageMenuItem title='Create tournament'
                               description='Connect matches to one tournament'
                               link='/create-tournament' />

            <FrontPageMenuItem title='Live score'
                               description='Get live score from an tournament or one match'
                               link='/tournaments' />
          </Container>
        </main>
      </div>
  );
};


const FrontPageMenuItem = ({title, link, description}) => {
  const classes = useStyles();
  return <Card classes={{root: classes.card}}>
    <CardActionArea component={ButtonLink} href={link}>
      <React.Fragment>
        <CardMedia
          component='img'
          image='static/img/match.jpg'
          height='200'
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </React.Fragment>
    </CardActionArea>
    {/* <CardActions>
      <Button component={ButtonLink} href={link} color='primary'>{title}</Button>
    </CardActions>*/}
  </Card>
}
