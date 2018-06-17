<!DOCTYPE html>
<html>
<body>

    <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'></script>
        
        <button type="button" onclick="$.getJSON('https://api.infura.io/v1/jsonrpc/ropsten/eth_blockNumber?token=g2QPsdYZHCrYrNd13JWf', function (res) {

        console.log(res);

})">get block number test</button>

    

</body >
</html >
