import Head from 'next/head';
import Main from './main';
export default () => (
        <div>
        <Head>
            <title>Scoreboard for the Lazy Volleyball Referee</title>
            <link rel="stylesheet" href="/static/css/bootstrap-3.3.1.css" />
            <link rel="stylesheet" href="/static/css/app.css" type="text/css"/>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <script src="/static/js/es5-shim.min.js"></script>
            <script src="/static/js/es6-shim.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.min.js"></script>
            <script>
                window.socket = io();
            </script>
        </Head>
        <div>
            <Main />
        </div>
    </div>

)