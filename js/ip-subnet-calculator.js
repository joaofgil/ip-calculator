function gObj(obj) { return document.getElementById(obj); }
function trimAll(sString) { return sString.trim(); }
function isNumber(val) { val = val + ""; if (val.length < 1) return false; if (isNaN(val)) { return false; } else { return true; } }
function isInteger(val) { if (isNumber(val)) { return val % 1 === 0; } else { return false; } }

function clearForm(formObj) {
    var allElements = formObj.elements;
    for (i = 0; i < allElements.length; i++) {
        if (allElements[i].type == "text" || allElements[i].type == "number" || allElements[i].type == "date" || allElements[i].type == "textarea") allElements[i].value = "";
    }
    document.getElementById("resultIP").innerText = "";
    document.getElementById("resultNetwork").innerText = "";
    document.getElementById("resultHostRange").innerText = "";
    document.getElementById("resultBroadcast").innerText = "";
    document.getElementById("resultTotalHosts").innerText = "";
    document.getElementById("resultUsableHosts").innerText = "";
    document.getElementById("errorMsg").innerHTML = "";
}

csubnet = '30'
function setSubnetV(inval) {
    csubnet = inval;
    return false;
}

function popSubnet(inval) {
    var lowerlimit = 0;
    if (inval == 'a') lowerlimit = 8;
    if (inval == 'b') lowerlimit = 16;
    if (inval == 'c') lowerlimit = 24;

    var allSubnets = [[32, '255.255.255.255 /32'], [31, '255.255.255.254 /31'], [30, '255.255.255.252 /30'], [29, '255.255.255.248 /29'], [28, '255.255.255.240 /28'], [27, '255.255.255.224 /27'], [26, '255.255.255.192 /26'], [25, '255.255.255.128 /25'], [24, '255.255.255.0 /24'], [23, '255.255.254.0 /23'], [22, '255.255.252.0 /22'], [21, '255.255.248.0 /21'], [20, '255.255.240.0 /20'], [19, '255.255.224.0 /19'], [18, '255.255.192.0 /18'], [17, '255.255.128.0 /17'], [16, '255.255.0.0 /16'], [15, '255.254.0.0 /15'], [14, '255.252.0.0 /14'], [13, '255.248.0.0 /13'], [12, '255.240.0.0 /12'], [11, '255.224.0.0 /11'], [10, '255.192.0.0 /10'], [9, '255.128.0.0 /9'], [8, '255.0.0.0 /8'], [7, '254.0.0.0 /7'], [6, '252.0.0.0 /6'], [5, '248.0.0.0 /5'], [4, '240.0.0.0 /4'], [3, '224.0.0.0 /3'], [2, '192.0.0.0 /2'], [1, '128.0.0.0 /1']];
    var thisSelect = document.getElementById('csubnet');
    thisSelect.options.length = 0;
    for (i = 0; i < allSubnets.length; i++) {
        if (allSubnets[i][0] >= lowerlimit) {
            var thisOption = document.createElement('option');
            thisOption.value = allSubnets[i][0];
            thisOption.innerHTML = allSubnets[i][1];
            if (csubnet == allSubnets[i][0]) thisOption.selected = true;
            thisSelect.appendChild(thisOption);
            
        }
    }
}

function ipToBinary(ip) {
    return ip.split('.').map(octet => ('00000000' + parseInt(octet, 10).toString(2)).slice(-8)).join('');
}

function binaryToIP(binary) {
    return binary.match(/.{8}/g).map(bin => parseInt(bin, 2)).join('.');
}

function calculateSubnet() {
    document.getElementById("errorMsg").innerHTML = "";
    let ip = document.getElementById("cip").value;
    let subnetBits = parseInt(csubnet);
    
    if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
        document.getElementById("errorMsg").innerHTML = "Invalid IP Address";
        document.getElementById("resultIP").innerText = "";
        document.getElementById("resultNetwork").innerText = "";
        document.getElementById("resultHostRange").innerText = "";
        document.getElementById("resultBroadcast").innerText = "";
        document.getElementById("resultTotalHosts").innerText = "";
        document.getElementById("resultUsableHosts").innerText = "";
        return;
    }
    
    let ipBinary = ipToBinary(ip);
    let networkBinary = ipBinary.slice(0, subnetBits) + '0'.repeat(32 - subnetBits);
    let broadcastBinary = ipBinary.slice(0, subnetBits) + '1'.repeat(32 - subnetBits);
    
    let networkAddress = binaryToIP(networkBinary);
    let broadcastAddress = binaryToIP(broadcastBinary);
    
    let totalHosts = Math.pow(2, 32 - subnetBits);
    let usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;
    let firstUsable = totalHosts > 2 ? binaryToIP((BigInt('0b' + networkBinary) + 1n).toString(2).padStart(32, '0')) : "N/A";
    let lastUsable = totalHosts > 2 ? binaryToIP((BigInt('0b' + broadcastBinary) - 1n).toString(2).padStart(32, '0')) : "N/A";

    document.getElementById("resultIP").innerText = ip;
    document.getElementById("resultNetwork").innerText = networkAddress;
    document.getElementById("resultHostRange").innerText = `${firstUsable} - ${lastUsable}`;
    document.getElementById("resultBroadcast").innerText = broadcastAddress;
    document.getElementById("resultTotalHosts").innerText = totalHosts;
    document.getElementById("resultUsableHosts").innerText = usableHosts;
}

popSubnet('any');