var self, id, collection, image, elName, contract;
var set = new Set();
var array = [];
const apiKey = process.env.API_KEY;

function getData() {
    set.clear();
    document.querySelectorAll('.box').forEach(e => e.remove());
    self = document.getElementById("input").value.toLowerCase();

    $.getJSON(`https://api.etherscan.io/api?module=account&action=tokennfttx&address=` + self + `&page=1&offset=10000&sort=asc&apikey=${apiKey}`, function(data) {
        console.log(data);

        if (data.message === "No transactions found") {
            removeError();
            $("#error1").addClass('active');
        } else if (data.message === "NOTOK") {
            removeError();
            $("#error2").addClass('active');
        } else {
            removeError();
            for (let i = 0; i < data.result.length; i++) {
                if (data.result[i].from === self) {
                    set.delete(data.result[i].tokenName + "|" + data.result[i].tokenID + "|" + data.result[i].contractAddress);
                } else {
                    set.add(data.result[i].tokenName + "|" + data.result[i].tokenID + "|" + data.result[i].contractAddress);
                }
            }

            if (set.size == 0) {
                removeError();
                $("#error1").addClass('active');
            } else {
                array = [];
                set.forEach(v => array.push(v));
                array.sort();

                for (let i = 0; i < array.length; i++) {
                    collection = array[i].split("|")[0];
                    id = array[i].split("|")[1];
                    contract = array[i].split("|")[2];
                    image = `https://img.rarible.com/prod/image/upload/t_preview/prod-itemImages/${contract}:${id}`

                    $("#grid-container").append(`<div class="box" id="box${i}" onclick="getDetails(${i});">
                        <div class="image" id="image${i}" style="background-image: url(${image});"></div>
                        <div class="info" id="info${i}">
                        <p class="truncate" id="p${i}">${collection}<br><span class="id" id="id${i}">${id}</span></p>
                        </div>
                    </div>`);
                }
            }
        }
    });
}

function getDetails(i) {
    var currContract = array[i].split("|")[2];
    var currId = array[i].split("|")[1];
    var currCollection = array[i].split("|")[0];
    var url = "https://api.rarible.com/protocol/v0.1/ethereum/nft/items/" + currContract + ":" + currId + "/meta";
    var traitsArray = [];
    document.getElementById("link").href = "https://opensea.io/assets/" + currContract + "/" + currId;
    $("#details-info-text").html(currCollection + "&nbsp;<span class=\"details-id\">" + currId + "</span>");
    $(".details-image").css('background-image', 'url(https://img.rarible.com/prod/image/upload/t_preview/prod-itemImages/' + currContract + ':' + currId + ')');

    $.getJSON(url, function(data) {
        for (let i = 0; i < data.attributes.length; i++) {
            traitsArray.push(data.attributes[i].key);
            traitsArray.push(data.attributes[i].value);
        };
        for (let i = 0; i < (traitsArray.length / 2); i++) {
            $(".details-grid-container").append(`<div class="details-box">${traitsArray[i*2]}: ${traitsArray[(i*2)+1]}</div>`);
        }
    });
    setTimeout(elevate, 150);
}

function elevate() {
    $(".box").addClass('under');
    $(".details-container").addClass('active');
    $(".details-container-wrapper").addClass('active');
    $("body").css('background-color', 'rgb(180, 180, 180)');
    $("header").css('opacity', '0.05');
}

function removeElevated() {
    $(".box").removeClass('under');
    $(".details-container").removeClass('active');
    $("body").css('background-color', 'rgb(245, 245, 245)');
    $("header").css('opacity', '1');
    document.querySelectorAll('.details-box').forEach(e => e.remove());
    setTimeout(removeWrapper, 50);
}

function removeError() {
    $("#error1").removeClass('active');
    $("#error2").removeClass('active');
}

function removeWrapper() {
    $(".details-container-wrapper").removeClass('active');
}

function intro() {
    $("#svgLogo").addClass('active');
    $("#svgCircle").addClass('active');
}

function removeIntro() {
    $("#svgLogo").removeClass('active');
    $("#svgCircle").removeClass('active');
}