// tslint:disable:max-line-length

/** Small BOF PDA tst data - Just contains 4 events with both postcode and grid referance, postcode only, grid referece only and neither */
export const smalltestBOFPDAFile = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
		<title>Fixture List</title>

		<style type="text/css">
			th {
				text-align: left;
			}
			td{
				font-size: 10px;
				padding: 3px 0;
			}
			table{
				width: 100%;
			}
			input{
				margin-right: 10px;
			}
			select{
				margin-right: 20px;
			}
		</style>
	</head>

	<body style="font-family: Arial; font-size: 10pt;">
<div style="background-color: #eee; padding: 10px; margin-bottom: 30px;"><form method="get" action="/event_diary_pda.php"><input type="hidden" name="pg" value="" /><div class="filter"><div class="filter "><label for="filter_assoc">Association</label> <select class="form-control" id="filter_assoc" name="filter_assoc"><option>Select...</option><option value="14">BOF</option><option value="13">BSOA</option><option value="1">EAOA</option><option value="2">EMOA</option><option value="3">NEOA</option><option value="4">NIOA</option><option value="5">NWOA</option><option value="6">SCOA</option><option value="7">SEOA</option><option value="8">SOA</option><option value="9">SWOA</option><option value="10">WMOA</option><option value="11">WOA</option><option value="12">YHOA</option></select></span></div> &nbsp;&nbsp;

			<div class="filter "><label for="filter_club" style="padding-left: 10px;">Club</label> <span id="filter_club_holder"><select class="form-control" id="filter_club" name="filter_club"><option>Select...</option><option value="23">AIRE</option><option value="147">AROS</option><option value="158">AUOC</option><option value="58">AYROC</option><option value="89">BADO</option><option value="117">BAOC</option><option value="62">BASOC</option><option value="91">BKO</option><option value="60">BL</option><option value="152">BOF</option><option value="44">BOK</option><option value="92">CHIG</option><option value="24">CLARO</option><option value="41">CLOK</option><option value="63">CLYDE</option><option value="38">COBOC</option><option value="112">CUOC</option><option value="61">DEE</option><option value="45">DEVON</option><option value="94">DFOK</option><option value="139">DRONGO</option><option value="134">DUOC</option><option value="21">DVO</option><option value="25">EBOR</option><option value="65">ECKO</option><option value="67">ELO</option><option value="26">EPOC</option><option value="53">ERYRI</option><option value="68">ESOC</option><option value="111">EUOC</option><option value="87">FERMO</option><option value="69">FVO</option><option value="120">GMOA</option><option value="95">GO</option><option value="71">GRAMP</option><option value="153">GUOC</option><option value="27">HALO</option><option value="32">HAVOC</option><option value="96">HH</option><option value="39">HOC</option><option value="72">INT</option><option value="73">INVOC</option><option value="121">JOK</option><option value="46">KERNO</option><option value="74">KFO</option><option value="29">LEI</option><option value="64">LOC</option><option value="30">LOG</option><option value="97">LOK</option><option value="157">LUOC</option><option value="151">LUUOC</option><option value="88">LVO</option><option value="75">MAROC</option><option value="161">Masterplan Adventure</option><option value="66">MDOC</option><option value="76">MOR</option><option value="99">MV</option><option value="54">MWOC</option><option value="50">NATO</option><option value="15">NGOC</option><option value="55">NN</option><option value="31">NOC</option><option value="33">NOR</option><option value="135">NUFOC</option><option value="47">NWO</option><option value="90">NWOC</option><option value="19">OD</option><option value="163">OROX</option><option value="114">OUOC</option><option value="78">PFO</option><option value="40">POTOC</option><option value="48">QO</option><option value="115">RAFO</option><option value="128">RNRMOC</option><option value="77">RR</option><option value="159">RSOC</option><option value="49">SARUM</option><option value="108">SAX</option><option value="56">SBOC</option><option value="79">SELOC</option><option value="129">SHUOC</option><option value="100">SLOW</option><option value="34">SMOC</option><option value="101">SN</option><option value="105">SO</option><option value="102">SOC</option><option value="103">SOFA</option><option value="80">SOLWAY</option><option value="35">SOS</option><option value="130">SPLOT</option><option value="81">SROC</option><option value="82">STAG</option><option value="36">SUFFOC</option><option value="57">SWOC</option><option value="28">SYO</option><option value="84">TAY</option><option value="86">TINTO</option><option value="104">TVOC</option><option value="132">UBOC</option><option value="37">WAOC</option><option value="83">WAROC</option><option value="42">WCH</option><option value="85">WCOC</option><option value="106">WIGHTO</option><option value="51">WIM</option><option value="43">WRE</option><option value="52">WSX</option><option value="136">WYE</option><option value="160">Xplorer</option></select></span></div> &nbsp;&nbsp;
			<input type="hidden" id="evt_website" /></div><div class="filter"><label style="padding-left: 10px;" for="evt_postcode">Postcode</label> <input class="form-control" type="text" id="evt_postcode" name="evt_postcode" value="" /> </div><div class="filter"><label style="padding-left: 10px;" for="evt_radius">Radius</label> <select class="form-control" id="evt_radius" name="evt_radius">
<option value="0">-</option>
<option value="25">25</option>
<option value="50">50</option>
<option value="100">100</option>
<option value="150">150</option>
</select></div><div class="filter full radiogroup"><span class="radiogroup-label">Level</span>
				<div class="radio-container">
					<input class="" type="checkbox" name="evt_level[]" id="evt_level_act" value="-1" />
					<label for="evt_level_act" class="optlabel">Activities</label>
				</div><div class="radio-container">
<input class="" type="checkbox" name="evt_level[]" id="evt_level_4" value="4" />
<label for="evt_level_4" class="optlabel">Local</label>
</div><div class="radio-container">
<input class="" type="checkbox" name="evt_level[]" id="evt_level_3" value="3" />
<label for="evt_level_3" class="optlabel">Regional</label>
</div><div class="radio-container">
<input class="" type="checkbox" name="evt_level[]" id="evt_level_2" value="2" />
<label for="evt_level_2" class="optlabel">National</label>
</div><div class="radio-container">
<input class="" type="checkbox" name="evt_level[]" id="evt_level_1" value="1" />
<label for="evt_level_1" class="optlabel">Major</label>
</div><div class="radio-container">
<input class="" type="checkbox" name="evt_level[]" id="evt_level_5" value="5" />
<label for="evt_level_5" class="optlabel">International</label>
</div></div>
<div class="filter-buttons"><input class="btn btn-success" type="submit" name="bFilter" value="Filter" style="margin-left: 10px;" />
<input class="btn btn-success" type="submit" name="bClear" value="Clear" /></div></form></div><div class="table-container listing"><table class="table standard standard smalltabletext"><tr><th style="width: 110px">Date</th><th>Event Name</th><th style="width: 65px">Level</th><th>Club</th><th>Ass.</th><th>Venue</th><th>Nearest Town<th>Grid Ref.</th></tr><tr style="background-color: #FFF"><td>Sun 24/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72446&amp;bpg=">SROC Red Rose Classic</a></td>
				<td>National</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD393805&amp;z=126">Hampsfell</a></td>
				<td>Grange over Sands</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD393805&amp;z=126">SD393805</a></td></tr><tr style="background-color: #FFF"><td>Thu 28/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76012&amp;bpg=">Spring series 4, Whitehaven</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td></td>
				<td>Whitehaven</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26377&amp;bpg=">Postcode</a></td>
				<td>Activity</td>
				<td><a href="http://www.quantockorienteers.co.uk" target="_blank">QO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TA1 2RH&amp;z=126">Blackbrook and Holway</a></td>
				<td>Taunton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TA1 2RH&amp;z=126"></a></td></tr></table></div>	</body>
</html>
`;

/** Example of full  BOF PDA fixtures data file (as per https://www.britishorienteering.org.uk/event_diary_pda.php) */
export const testBOFPDAFile = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
		<title>Fixture List</title>

		<style type="text/css">
			th {
				text-align: left;
			}
			td{
				font-size: 10px;
				padding: 3px 0;
			}
			table{
				width: 100%;
			}
			input{
				margin-right: 10px;
			}
			select{
				margin-right: 20px;
			}
		</style>
	</head>

	<body style="font-family: Arial; font-size: 10pt;">
<div style="background-color: #eee; padding: 10px; margin-bottom: 30px;"><form method="get" action="/event_diary_pda.php"><input type="hidden" name="pg" value="" /><div class="filter"><div class="filter "><label for="filter_assoc">Association</label> <select class="form-control" id="filter_assoc" name="filter_assoc"><option>Select...</option><option value="14">BOF</option><option value="13">BSOA</option><option value="1">EAOA</option><option value="2">EMOA</option><option value="3">NEOA</option><option value="4">NIOA</option><option value="5">NWOA</option><option value="6">SCOA</option><option value="7">SEOA</option><option value="8">SOA</option><option value="9">SWOA</option><option value="10">WMOA</option><option value="11">WOA</option><option value="12">YHOA</option></select></span></div> &nbsp;&nbsp;

			<div class="filter "><label for="filter_club" style="padding-left: 10px;">Club</label> <span id="filter_club_holder"><select class="form-control" id="filter_club" name="filter_club"><option>Select...</option><option value="23">AIRE</option><option value="147">AROS</option><option value="158">AUOC</option><option value="58">AYROC</option><option value="89">BADO</option><option value="117">BAOC</option><option value="62">BASOC</option><option value="91">BKO</option><option value="60">BL</option><option value="152">BOF</option><option value="44">BOK</option><option value="92">CHIG</option><option value="24">CLARO</option><option value="41">CLOK</option><option value="63">CLYDE</option><option value="38">COBOC</option><option value="112">CUOC</option><option value="61">DEE</option><option value="45">DEVON</option><option value="94">DFOK</option><option value="139">DRONGO</option><option value="134">DUOC</option><option value="21">DVO</option><option value="25">EBOR</option><option value="65">ECKO</option><option value="67">ELO</option><option value="26">EPOC</option><option value="53">ERYRI</option><option value="68">ESOC</option><option value="111">EUOC</option><option value="87">FERMO</option><option value="69">FVO</option><option value="120">GMOA</option><option value="95">GO</option><option value="71">GRAMP</option><option value="153">GUOC</option><option value="27">HALO</option><option value="32">HAVOC</option><option value="96">HH</option><option value="39">HOC</option><option value="72">INT</option><option value="73">INVOC</option><option value="121">JOK</option><option value="46">KERNO</option><option value="74">KFO</option><option value="29">LEI</option><option value="64">LOC</option><option value="30">LOG</option><option value="97">LOK</option><option value="157">LUOC</option><option value="151">LUUOC</option><option value="88">LVO</option><option value="75">MAROC</option><option value="161">Masterplan Adventure</option><option value="66">MDOC</option><option value="76">MOR</option><option value="99">MV</option><option value="54">MWOC</option><option value="50">NATO</option><option value="15">NGOC</option><option value="55">NN</option><option value="31">NOC</option><option value="33">NOR</option><option value="135">NUFOC</option><option value="47">NWO</option><option value="90">NWOC</option><option value="19">OD</option><option value="163">OROX</option><option value="114">OUOC</option><option value="78">PFO</option><option value="40">POTOC</option><option value="48">QO</option><option value="115">RAFO</option><option value="128">RNRMOC</option><option value="77">RR</option><option value="159">RSOC</option><option value="49">SARUM</option><option value="108">SAX</option><option value="56">SBOC</option><option value="79">SELOC</option><option value="129">SHUOC</option><option value="100">SLOW</option><option value="34">SMOC</option><option value="101">SN</option><option value="105">SO</option><option value="102">SOC</option><option value="103">SOFA</option><option value="80">SOLWAY</option><option value="35">SOS</option><option value="130">SPLOT</option><option value="81">SROC</option><option value="82">STAG</option><option value="36">SUFFOC</option><option value="57">SWOC</option><option value="28">SYO</option><option value="84">TAY</option><option value="86">TINTO</option><option value="104">TVOC</option><option value="132">UBOC</option><option value="37">WAOC</option><option value="83">WAROC</option><option value="42">WCH</option><option value="85">WCOC</option><option value="106">WIGHTO</option><option value="51">WIM</option><option value="43">WRE</option><option value="52">WSX</option><option value="136">WYE</option><option value="160">Xplorer</option></select></span></div> &nbsp;&nbsp;
			<input type="hidden" id="evt_website" /></div><div class="filter"><label style="padding-left: 10px;" for="evt_postcode">Postcode</label> <input class="form-control" type="text" id="evt_postcode" name="evt_postcode" value="" /> </div><div class="filter"><label style="padding-left: 10px;" for="evt_radius">Radius</label> <select class="form-control" id="evt_radius" name="evt_radius">
<option value="0">-</option>
<option value="25">25</option>
<option value="50">50</option>
<option value="100">100</option>
<option value="150">150</option>
</select></div><div class="filter full radiogroup"><span class="radiogroup-label">Level</span>
				<div class="radio-container">
					<input class="" type="checkbox" name="evt_level[]" id="evt_level_act" value="-1" />
					<label for="evt_level_act" class="optlabel">Activities</label>
				</div><div class="radio-container">
<input class="" type="checkbox" name="evt_level[]" id="evt_level_4" value="4" />
<label for="evt_level_4" class="optlabel">Local</label>
</div><div class="radio-container">
<input class="" type="checkbox" name="evt_level[]" id="evt_level_3" value="3" />
<label for="evt_level_3" class="optlabel">Regional</label>
</div><div class="radio-container">
<input class="" type="checkbox" name="evt_level[]" id="evt_level_2" value="2" />
<label for="evt_level_2" class="optlabel">National</label>
</div><div class="radio-container">
<input class="" type="checkbox" name="evt_level[]" id="evt_level_1" value="1" />
<label for="evt_level_1" class="optlabel">Major</label>
</div><div class="radio-container">
<input class="" type="checkbox" name="evt_level[]" id="evt_level_5" value="5" />
<label for="evt_level_5" class="optlabel">International</label>
</div></div>
<div class="filter-buttons"><input class="btn btn-success" type="submit" name="bFilter" value="Filter" style="margin-left: 10px;" />
<input class="btn btn-success" type="submit" name="bClear" value="Clear" /></div></form></div><div class="table-container listing"><table class="table standard standard smalltabletext"><tr><th style="width: 110px">Date</th><th>Event Name</th><th style="width: 65px">Level</th><th>Club</th><th>Ass.</th><th>Venue</th><th>Nearest Town<th>Grid Ref.</th></tr><tr style="background-color: #FFF"><td>Sun 24/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72446&amp;bpg=">SROC Red Rose Classic</a></td>
				<td>National</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD393805&amp;z=126">Hampsfell</a></td>
				<td>Grange over Sands</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD393805&amp;z=126">SD393805</a></td></tr><tr style="background-color: #FFF"><td>Thu 28/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76012&amp;bpg=">Spring series 4, Whitehaven</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td></td>
				<td>Whitehaven</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26377&amp;bpg=">Postcode</a></td>
				<td>Activity</td>
				<td><a href="http://www.quantockorienteers.co.uk" target="_blank">QO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TA1 2RH&amp;z=126">Blackbrook and Holway</a></td>
				<td>Taunton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TA1 2RH&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 24/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73310&amp;bpg=">East Anglian Championships</a></td>
				<td>National</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TG140410&amp;z=126">NT Sheringham Park</a></td>
				<td>North Norfolk</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TG140410&amp;z=126">TG140410</a></td></tr><tr style="background-color: #FFF"><td>Sun 24/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74081&amp;bpg=">DFOK Regional event</a></td>
				<td>Regional</td>
				<td><a href="http://www.dfok.co.uk" target="_blank">DFOK</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ323290&amp;z=126">Balcombe</a></td>
				<td>Crawley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ323290&amp;z=126">TQ323290</a></td></tr><tr style="background-color: #EEE"><td>Sun 24/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74106&amp;bpg=">East Midlands League 2019</a></td>
				<td>Regional</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK346518&amp;z=126">Crich Chase</a></td>
				<td>Belper</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK346518&amp;z=126">SK346518</a></td></tr><tr style="background-color: #FFF"><td>Sun 24/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74787&amp;bpg=">KFO Urban Event incorporating bto SOUL4</a></td>
				<td>Regional</td>
				<td><a href="http://www.kfo.org.uk/" target="_blank">KFO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT081875&amp;z=126">Dunfermline, Fife</a></td>
				<td>Dunfermline</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT081875&amp;z=126">NT081875</a></td></tr><tr style="background-color: #EEE"><td>Sun 24/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74818&amp;bpg=">Devon League Event 5</a></td>
				<td>Regional</td>
				<td><a href="http://www.devonorienteering.co.uk" target="_blank">DEVON</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ13 7NP&amp;z=126">River Dart Country Park</a></td>
				<td>Ashburton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ13 7NP&amp;z=126"></a></td></tr><tr style="background-color: #FFF" class="cancelledEvent"><td>Sun 24/03/19</td>
				<td class="cancelled_grey"><a href="index.php?pg=event&amp;amp;event=74945&amp;bpg=">(Cancelled) NGOC League 3</a></td>
				<td>Regional</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO609078&amp;z=126">Parkend</a></td>
				<td>Lydney</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO609078&amp;z=126">SO609078</a></td></tr><tr style="background-color: #EEE"><td>Sun 24/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75567&amp;bpg=">YHOA Urban League  </a></td>
				<td>Regional</td>
				<td><a href="http://www.eastpennineoc.org.uk" target="_blank">EPOC</a></td>
				<td>YHOA</td>
				<td>Elland</td>
				<td>Elland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 24/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75891&amp;bpg=">GRAMP Glen Dye - Regional</a></td>
				<td>Regional</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td>Glen Dye</td>
				<td>Banchory</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 24/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26779&amp;bpg=">Newcomers Series Laighills Dunblane</a></td>
				<td>Activity</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=FK15 0AW&amp;z=126">Laighills Park</a></td>
				<td>Dunblane</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=FK15 0AW&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 24/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26927&amp;bpg=">Highland Adventure Festival </a></td>
				<td>Activity</td>
				<td><a href="http://www.invoc.org.uk" target="_blank">INVOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV3 5SS&amp;z=126">Aquadome, Bucht Park, Inverness</a></td>
				<td>Inverness</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV3 5SS&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Mon 25/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26519&amp;bpg=">EBOR Club Night  </a></td>
				<td>Activity</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=YO23 1WF&amp;z=126">Millthorpe School</a></td>
				<td>York</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=YO23 1WF&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Mon 25/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26720&amp;bpg=">Monday Night Club    </a></td>
				<td>Activity</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LE67 9TB&amp;z=126">South Charnwood High School</a></td>
				<td>Leicester</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LE67 9TB&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 26/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74873&amp;bpg=">MV Street O</a></td>
				<td>Local</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td>Lower Morden</td>
				<td>Lower Morden</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Tue 26/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75406&amp;bpg=">Night O Series Race 5</a></td>
				<td>Local</td>
				<td><a href="http://slow.org.uk/" target="_blank">SLOW</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ194699&amp;z=126">Richmond Park</a></td>
				<td>Richmond</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ194699&amp;z=126">TQ194699</a></td></tr><tr style="background-color: #EEE"><td>Tue 26/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26666&amp;bpg=">Tuesday Hill Reps                                                                 </a></td>
				<td>Activity</td>
				<td><a href="http://www.wessex-oc.org" target="_blank">WSX</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH12 5BB&amp;z=126">Bournemouth University</a></td>
				<td>Poole</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH12 5BB&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 26/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26704&amp;bpg=">BOK Tuesday Training - Efforts</a></td>
				<td>Activity</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BS1 6XG&amp;z=126">The Cottage Inn</a></td>
				<td>Bristol Harbourside</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BS1 6XG&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 26/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26817&amp;bpg=">Tilgate Night Training</a></td>
				<td>Activity</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=RH10 5PQ&amp;z=126">Car park on Tilgate Drive</a></td>
				<td>Crawley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=RH10 5PQ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 26/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26822&amp;bpg=">BASOC Tuesday training Inshriach</a></td>
				<td>Activity</td>
				<td><a href="http://www.basoc.org.uk/" target="_blank">BASOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PH21 1NG&amp;z=126">Inshriach</a></td>
				<td>Kincraig</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PH21 1NG&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 27/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75735&amp;bpg=">Spring Pub League 6 - North Bransholme</a></td>
				<td>Local</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=HU7 5DD&amp;z=126">North Bransholme Community Centre</a></td>
				<td>Kingston upon Hull</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=HU7 5DD&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 27/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76106&amp;bpg=">TVOC Oxford Street Series</a></td>
				<td>Local</td>
				<td><a href="http://www.tvoc.org.uk" target="_blank">TVOC</a></td>
				<td>SCOA</td>
				<td>Didcot</td>
				<td>Didcot</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 27/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76364&amp;bpg=">BAOC Trg Event</a></td>
				<td>Local</td>
				<td><a href="http://www.baoc.info/" target="_blank">BAOC</a></td>
				<td>SWOA</td>
				<td>Defence Academy</td>
				<td>Shrivenham</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 27/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=25767&amp;bpg=">Winter activity evening         </a></td>
				<td>Activity</td>
				<td><a href="http://www.dfok.co.uk" target="_blank">DFOK</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=DA16 3RP&amp;z=126">Woodland Farm Trust</a></td>
				<td>Eltham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=DA16 3RP&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 27/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26241&amp;bpg=">Club Night - Running Training</a></td>
				<td>Activity</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT6 9GL&amp;z=126">Connswater Greenway</a></td>
				<td>Belfast</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT6 9GL&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 27/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26550&amp;bpg=">ESOC Wednesday Training</a></td>
				<td>Activity</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td>Pentland Hills/Edinburgh Parks</td>
				<td>Edinburgh</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 27/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26565&amp;bpg=">Rossendale Club Night</a></td>
				<td>Activity</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB4 7SN&amp;z=126">Marl Pits Leisure Centre, Newchurch Road, Rawtenstall</a></td>
				<td>Rawtenstall</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB4 7SN&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 27/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26929&amp;bpg=">Training Braco</a></td>
				<td>Activity</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=FK15 9LB&amp;z=126">Braco</a></td>
				<td>Braco</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=FK15 9LB&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Thu 28/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75259&amp;bpg=">staffordshire schools - closed event</a></td>
				<td>Local</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ886487&amp;z=126">central forest park --tbc</a></td>
				<td>Hanley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ886487&amp;z=126">SJ886487</a></td></tr><tr style="background-color: #FFF"><td>Thu 28/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75456&amp;bpg=">Central Line Street O series</a></td>
				<td>Local</td>
				<td><a href="http://www.chig.org.uk" target="_blank">CHIG</a></td>
				<td>SEOA</td>
				<td>Stratford</td>
				<td>Stratford</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 28/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75546&amp;bpg=">SAX Kent Night Cup</a></td>
				<td>Local</td>
				<td><a href="http://www.saxons-oc.org" target="_blank">SAX</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ544540&amp;z=126">Knole Park</a></td>
				<td>Sevenoaks</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ544540&amp;z=126">TQ544540</a></td></tr><tr style="background-color: #EEE" class="cancelledEvent"><td>Fri 29/03/19</td>
				<td class="cancelled_grey"><a href="index.php?pg=event&amp;amp;event=76115&amp;bpg=">(Cancelled) South Powys Primary Schools Championships</a></td>
				<td>Local</td>
				<td><a href="http://www.mid-wales-orienteers.org.uk" target="_blank">MWOC</a></td>
				<td>WOA</td>
				<td>Nash Woods</td>
				<td>Presteigne</td>
				<td></td></tr><tr style="background-color: #FFF" class="cancelledEvent"><td>Sat 30/03/19</td>
				<td class="cancelled_grey"><a href="index.php?pg=event&amp;amp;event=73666&amp;bpg=">(Cancelled) NGOC Southern Champs Weekend Middle Distance Event (UKOL)</a></td>
				<td>National</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO550125&amp;z=126">Knockalls Inclosure (West)</a></td>
				<td>Monmouth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO550125&amp;z=126">SO550125</a></td></tr><tr style="background-color: #EEE"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74163&amp;bpg=">Scottish Middle Distance Championships (incorporating BUCS Individual Long Distance)</a></td>
				<td>National</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td>Birnam Hill</td>
				<td>Dunkeld</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74911&amp;bpg=">Aughertree Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.bl-orienteering.org.uk/" target="_blank">BL</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY267373&amp;z=126">Aughertree Fell, Nr Caldbeck</a></td>
				<td>Penrith/ Keswick</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY267373&amp;z=126">NY267373</a></td></tr><tr style="background-color: #EEE"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75001&amp;bpg=">Beginners, Families and Schools Events</a></td>
				<td>Local</td>
				<td><a href="http://www.coboc.org.uk" target="_blank">COBOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP060921&amp;z=126">Perry Hall Park</a></td>
				<td>Birmingham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP060921&amp;z=126">SP060921</a></td></tr><tr style="background-color: #FFF"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75040&amp;bpg=">SROC spring series event 1</a></td>
				<td>Local</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PR3 2NL&amp;z=126">Beacon Fell</a></td>
				<td>Garstang</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PR3 2NL&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75221&amp;bpg=">ELO Local Events in Edinburgh and the Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.elo.org.uk" target="_blank">ELO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT593801&amp;z=126">Binning Wood</a></td>
				<td>East Linton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT593801&amp;z=126">NT593801</a></td></tr><tr style="background-color: #FFF"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75467&amp;bpg=">TVOC Saturday Series Christmas Common</a></td>
				<td>Local</td>
				<td><a href="http://www.tvoc.org.uk" target="_blank">TVOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU711918&amp;z=126">Christmas Common</a></td>
				<td>Christmas Common</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU711918&amp;z=126">SU711918</a></td></tr><tr style="background-color: #EEE"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75803&amp;bpg=">SO SOG S5 - River's Wood, Haywards Heath (note the later start-times than usual - 12.30-13.45)</a></td>
				<td>Local</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ326274&amp;z=126">Rivers Wood</a></td>
				<td>Haywards Heath</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ326274&amp;z=126">TQ326274</a></td></tr><tr style="background-color: #FFF"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76034&amp;bpg=">Explore The Parks</a></td>
				<td>Local</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK505380&amp;z=126">Bramcote Hills Park</a></td>
				<td>Nottingham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK505380&amp;z=126">SK505380</a></td></tr><tr style="background-color: #EEE"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76230&amp;bpg=">EBOR Spring Series</a></td>
				<td>Local</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE805485&amp;z=126">Pocklington</a></td>
				<td>Pocklington</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE805485&amp;z=126">SE805485</a></td></tr><tr style="background-color: #FFF"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76242&amp;bpg=">Chesham Woods Saturday Series</a></td>
				<td>Local</td>
				<td><a href="http://www.seloc.org.uk" target="_blank">SELOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD809122&amp;z=126">Chesham Woods</a></td>
				<td>Bury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD809122&amp;z=126">SD809122</a></td></tr><tr style="background-color: #FFF"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26797&amp;bpg=">Planners course </a></td>
				<td>Activity</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=WS15 2UZ&amp;z=126">JohnO'leary centre  marquis drive </a></td>
				<td>Cannock </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=WS15 2UZ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26802&amp;bpg=">OD 'Come &amp; Try Orienteering' at Abbey Fields, Kenilworth</a></td>
				<td>Activity</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CV8 1BP&amp;z=126">Abbey Fields</a></td>
				<td>Kenilworth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CV8 1BP&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 30/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26935&amp;bpg=">Coaching Activity </a></td>
				<td>Activity</td>
				<td><a href="http://southampton-orienteers.org.uk" target="_blank">SOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO51 7LT&amp;z=126">To be advised</a></td>
				<td>To be advised </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO51 7LT&amp;z=126"></a></td></tr><tr style="background-color: #EEE" class="cancelledEvent"><td>Sun 31/03/19</td>
				<td class="cancelled_grey"><a href="index.php?pg=event&amp;amp;event=71664&amp;bpg=">(Cancelled) Mike Nelson BOK Trot and Southern Championships (UKOL)</a></td>
				<td>Major</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO621118&amp;z=126">Churchill Inclosure and Cannop Ponds</a></td>
				<td>Coleford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO621118&amp;z=126">SO621118</a></td></tr><tr style="background-color: #FFF"><td>Sun 31/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73632&amp;bpg=">CompassPoint Scottish Orienteering League 2 (incorporating BUCS relay)</a></td>
				<td>National</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td>Dumyat</td>
				<td>Stirling</td>
				<td></td></tr><tr style="background-color: #EEE" class="cancelledEvent"><td>Sun 31/03/19</td>
				<td class="cancelled_grey"><a href="index.php?pg=event&amp;amp;event=73729&amp;bpg=">(Cancelled) Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE688909&amp;z=126">Birch Hagg</a></td>
				<td>Pickering</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE688909&amp;z=126">SE688909</a></td></tr><tr style="background-color: #FFF"><td>Sun 31/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74830&amp;bpg=">SOS Hockley Wood SWELL</a></td>
				<td>Regional</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ822911&amp;z=126">Hockley Woods</a></td>
				<td>Rayleigh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ822911&amp;z=126">TQ822911</a></td></tr><tr style="background-color: #EEE"><td>Sun 31/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75731&amp;bpg=">PFO Spring Series 4 of 4</a></td>
				<td>Regional</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD766290&amp;z=126">Peel Park, Accrington</a></td>
				<td>Accrington</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD766290&amp;z=126">SD766290</a></td></tr><tr style="background-color: #FFF"><td>Sun 31/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76024&amp;bpg=">OCOUL 1</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT62 1ED&amp;z=126">Portadown People's Park</a></td>
				<td>Portadown</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT62 1ED&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 31/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76432&amp;bpg=">Hamsterley Cabin Hill, Doctors Gate and Gull Quarry</a></td>
				<td>Local</td>
				<td><a href="http://www.northern-navigators.org.uk" target="_blank">NN</a></td>
				<td>NEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ072337&amp;z=126"></a></td>
				<td>Hamsterley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ072337&amp;z=126">NZ072337</a></td></tr><tr style="background-color: #FFF"><td>Sun 31/03/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26894&amp;bpg=">Urban-O Explorers Open Day</a></td>
				<td>Activity</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT5 6BY&amp;z=126">Orangefield Park</a></td>
				<td>Belfast</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT5 6BY&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Mon 01/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76043&amp;bpg=">Spring Series</a></td>
				<td>Local</td>
				<td><a href="http://www.logonline.org.uk" target="_blank">LOG</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TF147739&amp;z=126">Chambers Wood</a></td>
				<td>Lincoln</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TF147739&amp;z=126">TF147739</a></td></tr><tr style="background-color: #FFF"><td>Mon 01/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26520&amp;bpg=">EBOR Club Night  </a></td>
				<td>Activity</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=YO23 1WF&amp;z=126">Millthorpe School</a></td>
				<td>York</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=YO23 1WF&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Mon 01/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26721&amp;bpg=">Monday Night Club    </a></td>
				<td>Activity</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LE67 9TB&amp;z=126">South Charnwood High School</a></td>
				<td>Leicester</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LE67 9TB&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 02/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26667&amp;bpg=">Tuesday Hill Reps                                                                         </a></td>
				<td>Activity</td>
				<td><a href="http://www.wessex-oc.org" target="_blank">WSX</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH12 5BB&amp;z=126">Bournemouth University</a></td>
				<td>Poole</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH12 5BB&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 02/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26818&amp;bpg=">Burgess Hill  60 minute Score</a></td>
				<td>Activity</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=RH15 9TB&amp;z=126">Parking in Poveys Close </a></td>
				<td>Burgess Hill</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=RH15 9TB&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 02/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26934&amp;bpg=">Bridgnorth Evening Activity</a></td>
				<td>Activity</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=WV16 4EN&amp;z=126">Main Ca Park </a></td>
				<td>Bridgnorth </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=WV16 4EN&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 03/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75203&amp;bpg=">STAG Spring 1</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS&amp;z=126">Whitecrook</a></td>
				<td>Clydebank</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS&amp;z=126">NS</a></td></tr><tr style="background-color: #FFF"><td>Wed 03/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75326&amp;bpg=">LOC Classic Series 1</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td>Great Tower Woods</td>
				<td>Newby Bridge</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 03/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75508&amp;bpg=">Mid-Week Winter Series No6</a></td>
				<td>Local</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TL894173&amp;z=126">Tiptree </a></td>
				<td>Tiptree</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TL894173&amp;z=126">TL894173</a></td></tr><tr style="background-color: #FFF"><td>Wed 03/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26243&amp;bpg=">Club Night - Running Training</a></td>
				<td>Activity</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT6 9GL&amp;z=126">Connswater Greenway</a></td>
				<td>Belfast</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT6 9GL&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 03/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26407&amp;bpg=">TAY monthly training</a></td>
				<td>Activity</td>
				<td><a href="http://taysideorienteers.org.uk" target="_blank">TAY</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PH1 5HS&amp;z=126">Bells Sports Centre, North Inch, Perth</a></td>
				<td>Perth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PH1 5HS&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Thu 04/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76013&amp;bpg=">Spring series 5, Camerton</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Camerton Meadows</td>
				<td>Workington</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74502&amp;bpg=">SN Saturday Series - Event 7</a></td>
				<td>Local</td>
				<td><a href="https://www.southernnavigators.com/" target="_blank">SN</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=GU10 4LS&amp;z=126">Alice Holt</a></td>
				<td>Farnham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=GU10 4LS&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74764&amp;bpg=">HH Saturday League</a></td>
				<td>Local</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TL307124&amp;z=126">Panshanger</a></td>
				<td>Welwyn Garden City</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TL307124&amp;z=126">TL307124</a></td></tr><tr style="background-color: #EEE"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75432&amp;bpg=">NI Colour Series 2</a></td>
				<td>Regional</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT33 0QB&amp;z=126">Meelmore</a></td>
				<td>Newcastle</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT33 0QB&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75698&amp;bpg=">WMOA Urban League 1 Redditch</a></td>
				<td>Regional</td>
				<td><a href="http://www.harlequins.org.uk" target="_blank">HOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP032656&amp;z=126">Redditch</a></td>
				<td>Redditch</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP032656&amp;z=126">SP032656</a></td></tr><tr style="background-color: #EEE"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75752&amp;bpg=">DFOK NW Kent 2</a></td>
				<td>Local</td>
				<td><a href="http://www.dfok.co.uk" target="_blank">DFOK</a></td>
				<td>SEOA</td>
				<td>Foots Cray Meadows</td>
				<td>Bexley</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75779&amp;bpg=">Solway Winter Saturday Morning Series (note - revised date)</a></td>
				<td>Local</td>
				<td><a href="http://www.solwayorienteers.co.uk" target="_blank">SOLWAY</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NX605562&amp;z=126">Cally Woods</a></td>
				<td>Gatehouse of Fleet</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NX605562&amp;z=126">NX605562</a></td></tr><tr style="background-color: #EEE"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75802&amp;bpg=">SO SOG S6 - Abbot's Wood, Hailsham</a></td>
				<td>Local</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ555073&amp;z=126">Abbots Wood</a></td>
				<td>Polegate</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ555073&amp;z=126">TQ555073</a></td></tr><tr style="background-color: #FFF"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75850&amp;bpg=">SBOC - Coaching for newcomers no 2 </a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Pembrey Country Park</td>
				<td>Llanelli</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76047&amp;bpg=">INT Local Events in Edinburgh and The Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.interlopers.org.uk/" target="_blank">INT</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT215701&amp;z=126">Colinton Dell</a></td>
				<td>Edinburgh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT215701&amp;z=126">NT215701</a></td></tr><tr style="background-color: #FFF"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76243&amp;bpg=">Nuttall Park Saturday Series</a></td>
				<td>Local</td>
				<td><a href="http://www.seloc.org.uk" target="_blank">SELOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD795164&amp;z=126">Nuttall Park</a></td>
				<td>Bury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD795164&amp;z=126">SD795164</a></td></tr><tr style="background-color: #EEE"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76429&amp;bpg=">Junior League 4 - RESCHEDULED FROM 16 MAR 19</a></td>
				<td>Local</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE349581&amp;z=126">Jacob Smith Park, Scriven Lane</a></td>
				<td>Knaresborough</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE349581&amp;z=126">SE349581</a></td></tr><tr style="background-color: #FFF"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26272&amp;bpg=">Clyde Training</a></td>
				<td>Activity</td>
				<td><a href="http://www.clydesideorienteers.org.uk/" target="_blank">CLYDE</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=G65 9SG&amp;z=126">Auchinstarry Marina</a></td>
				<td>Croy</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=G65 9SG&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26773&amp;bpg=">Calderdale Footquest. Navigation training </a></td>
				<td>Activity</td>
				<td><a href="http://www.eastpennineoc.org.uk" target="_blank">EPOC</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=HX2 6UE&amp;z=126">Midgley</a></td>
				<td>Halifax</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=HX2 6UE&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26835&amp;bpg=">Coaching session</a></td>
				<td>Activity</td>
				<td><a href="http://www.suffoc.co.uk" target="_blank">SUFFOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IP29 5LU&amp;z=126">Nowton Park</a></td>
				<td>Bury St Edmunds</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IP29 5LU&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 06/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26904&amp;bpg=">SBOC - Coaching for newcomers no 2		</a></td>
				<td>Activity</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SA16 0EJ&amp;z=126">Pembrey Country Park</a></td>
				<td>llanelli</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SA16 0EJ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 07/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73160&amp;bpg=">Acorn event</a></td>
				<td>National</td>
				<td><a href="http://www.clok.org.uk" target="_blank">CLOK</a></td>
				<td>NEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ552170&amp;z=126">Eston, Wilton and Lazenby</a></td>
				<td>Middlesbrough</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ552170&amp;z=126">NZ552170</a></td></tr><tr style="background-color: #EEE"><td>Sun 07/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74030&amp;bpg=">NWO Galoppen and Yvette Baker qualifier</a></td>
				<td>Regional</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU211663&amp;z=126">Savernake Forest </a></td>
				<td>Marlborough</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU211663&amp;z=126">SU211663</a></td></tr><tr style="background-color: #FFF"><td>Sun 07/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74070&amp;bpg=">SMOC EAL event</a></td>
				<td>Regional</td>
				<td><a href="http://www.smoc.info" target="_blank">SMOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP794516&amp;z=126">Salcey Forest</a></td>
				<td>Milton Keynes</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP794516&amp;z=126">SP794516</a></td></tr><tr style="background-color: #EEE"><td>Sun 07/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74180&amp;bpg=">Forest League 7</a></td>
				<td>Regional</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SW747415&amp;z=126">Poldice</a></td>
				<td>Redruth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SW747415&amp;z=126">SW747415</a></td></tr><tr style="background-color: #FFF"><td>Sun 07/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74619&amp;bpg=">SLOW Urban Event</a></td>
				<td>Regional</td>
				<td><a href="http://slow.org.uk/" target="_blank">SLOW</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ176711&amp;z=126">Kingston</a></td>
				<td>Kingston</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ176711&amp;z=126">TQ176711</a></td></tr><tr style="background-color: #EEE"><td>Sun 07/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74792&amp;bpg=">East Midlands League 2019</a></td>
				<td>Regional</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK446081&amp;z=126">Bagworth Woodlands</a></td>
				<td>Coalville</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK446081&amp;z=126">SK446081</a></td></tr><tr style="background-color: #FFF"><td>Sun 07/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75412&amp;bpg=">WMOA League Event  6 Arrow Valley</a></td>
				<td>Regional</td>
				<td><a href="http://www.harlequins.org.uk" target="_blank">HOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP063676&amp;z=126">Arrow Valley</a></td>
				<td>Redditch</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP063676&amp;z=126">SP063676</a></td></tr><tr style="background-color: #EEE"><td>Sun 07/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76170&amp;bpg=">FVO Beecraigs</a></td>
				<td>Local</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS998741&amp;z=126">Beecraigs</a></td>
				<td>Linlithgow</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS998741&amp;z=126">NS998741</a></td></tr><tr style="background-color: #FFF"><td>Sun 07/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76313&amp;bpg=">CARN OWEN</a></td>
				<td>Local</td>
				<td><a href="http://www.mid-wales-orienteers.org.uk" target="_blank">MWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SN735882&amp;z=126">Carn Owen,  Nant y Moch</a></td>
				<td>Tal y Bont</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SN735882&amp;z=126">SN735882</a></td></tr><tr style="background-color: #EEE"><td>Sun 07/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26801&amp;bpg=">Nothe Gardens, Weymouth POC Launch</a></td>
				<td>Activity</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=DT4 8UF&amp;z=126">Nothe Gardens, Weymouth</a></td>
				<td>Weymouth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=DT4 8UF&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 07/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26862&amp;bpg=">Coaching Session</a></td>
				<td>Activity</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LE67 1BR&amp;z=126">Bagworth Woods</a></td>
				<td>Coalville</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LE67 1BR&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Mon 08/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74806&amp;bpg=">WIM/WSX Monthly Evening event - Blandford Forum</a></td>
				<td>Local</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=DT11 7SW&amp;z=126">Blandford Forum</a></td>
				<td>Blandford Forum, Dorset</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=DT11 7SW&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Mon 08/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76044&amp;bpg=">Spring Series</a></td>
				<td>Local</td>
				<td><a href="http://www.logonline.org.uk" target="_blank">LOG</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK857560&amp;z=126">Stapleford Woods</a></td>
				<td>Lincoln</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK857560&amp;z=126">SK857560</a></td></tr><tr style="background-color: #EEE"><td>Mon 08/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26521&amp;bpg=">EBOR Club Night</a></td>
				<td>Activity</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=YO23 1WF&amp;z=126">Millthorpe School</a></td>
				<td>York</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=YO23 1WF&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Mon 08/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26722&amp;bpg=">Monday Night Club    </a></td>
				<td>Activity</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LE67 9TB&amp;z=126">South Charnwood High School</a></td>
				<td>Leicester</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LE67 9TB&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 09/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75401&amp;bpg=">Street O Series Race 8</a></td>
				<td>Local</td>
				<td><a href="http://slow.org.uk/" target="_blank">SLOW</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=KT2 7QE&amp;z=126"></a></td>
				<td>Norbiton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=KT2 7QE&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 09/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26869&amp;bpg=">Tuesday Hill Reps                                                                 </a></td>
				<td>Activity</td>
				<td><a href="http://www.wessex-oc.org" target="_blank">WSX</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH12 5BB&amp;z=126">Bournemouth University</a></td>
				<td>Poole</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH12 5BB&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 10/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75327&amp;bpg=">LOC Classic Series 2</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td>Colonel's Drive </td>
				<td>Newby Bridge</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 10/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75998&amp;bpg=">Poacher 1 - Primrose Wood</a></td>
				<td>Local</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Primrose Wood</td>
				<td>Scunthorpe</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 10/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26244&amp;bpg=">Club Night - Running Training</a></td>
				<td>Activity</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT6 9GL&amp;z=126">Connswater Greenway</a></td>
				<td>Belfast</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT6 9GL&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 10/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26381&amp;bpg=">STAG Postbox O - No.1</a></td>
				<td>Activity</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=G40 1DA&amp;z=126">Cambuslang &amp; Rutherglen</a></td>
				<td>Glasgow </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=G40 1DA&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 10/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26566&amp;bpg=">Rossendale Club Night</a></td>
				<td>Activity</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB4 7SN&amp;z=126">Marl Pits Leisure Centre, Newchurch Road, Rawtenstall</a></td>
				<td>Rawtenstall</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB4 7SN&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 10/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26831&amp;bpg=">evening street activity</a></td>
				<td>Activity</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST1 6QU&amp;z=126">Northwood and Hanley</a></td>
				<td>Hanley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST1 6QU&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Thu 11/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76014&amp;bpg=">Spring series 6, Knock Murton</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Knock Murton</td>
				<td>Cleator</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 13/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74946&amp;bpg=">NGOC League 4</a></td>
				<td>Regional</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO989275&amp;z=126">Cleeve Hill</a></td>
				<td>Cheltenham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO989275&amp;z=126">SO989275</a></td></tr><tr style="background-color: #EEE"><td>Sat 13/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75119&amp;bpg=">Scottish Spring 2019 Middle Distance</a></td>
				<td>Local</td>
				<td><a href="http://www.masterplanadventure.uk" target="_blank">Masterplan Adventure</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO498242&amp;z=126">Tentsmuir South</a></td>
				<td>Leuchars</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO498242&amp;z=126">NO498242</a></td></tr><tr style="background-color: #FFF"><td>Sat 13/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75120&amp;bpg=">Scottish Spring 2019 Sprint Distance incorporating bto SOUL5</a></td>
				<td>Local</td>
				<td><a href="http://www.masterplanadventure.uk" target="_blank">Masterplan Adventure</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO254073&amp;z=126">Falkland</a></td>
				<td>Falkland</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO254073&amp;z=126">NO254073</a></td></tr><tr style="background-color: #EEE"><td>Sat 13/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75260&amp;bpg=">ladderedge </a></td>
				<td>Local</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ972551&amp;z=126">Ladderedge country park -tbc</a></td>
				<td>LEEK</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ972551&amp;z=126">SJ972551</a></td></tr><tr style="background-color: #FFF"><td>Sat 13/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75765&amp;bpg=">Winter LOP 8</a></td>
				<td>Local</td>
				<td><a href="http://www.newcastleorienteering.org.uk" target="_blank">NATO</a></td>
				<td>NEOA</td>
				<td>Shankhouses</td>
				<td>Cramlington</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 13/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75801&amp;bpg=">SO SOG S7 - East Angmering, Arundel</a></td>
				<td>Local</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ071081&amp;z=126">E Angmering</a></td>
				<td>Arundel</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ071081&amp;z=126">TQ071081</a></td></tr><tr style="background-color: #FFF"><td>Sat 13/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75851&amp;bpg=">SBOC - Coaching for newcomers no 3</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Clyne Valley Country Park</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 13/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76162&amp;bpg=">Explore the Parks </a></td>
				<td>Local</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>University &amp; Highfields</td>
				<td>Nottingham</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 13/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76393&amp;bpg=">NWO Summer Street O Series</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU145811&amp;z=126">Wroughton</a></td>
				<td>Swindon</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU145811&amp;z=126">SU145811</a></td></tr><tr style="background-color: #EEE"><td>Sat 13/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26745&amp;bpg=">Sprint Training </a></td>
				<td>Activity</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LS16 1JW&amp;z=126">Holt Park, Farrar Lane Car Park</a></td>
				<td>Leeds</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LS16 1JW&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 13/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26746&amp;bpg=">Junior Coaching &amp; Sprint Training  </a></td>
				<td>Activity</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LS16 8NA&amp;z=126">Brownlee Centre, Bodington Way,</a></td>
				<td>Leeds</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LS16 8NA&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 13/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26905&amp;bpg=">SBOC - Coaching for newcomers no 3		 </a></td>
				<td>Activity</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SA2 8DU&amp;z=126">Clyne Valley Country Park</a></td>
				<td>Swansea</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SA2 8DU&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 14/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73633&amp;bpg=">CompassPoint Scottish Orienteering League 3 Scottish Spring 2019</a></td>
				<td>National</td>
				<td><a href="http://www.masterplanadventure.uk" target="_blank">Masterplan Adventure</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO242075&amp;z=126">Falkland Estate</a></td>
				<td>Falkland</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO242075&amp;z=126">NO242075</a></td></tr><tr style="background-color: #EEE"><td>Sun 14/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73749&amp;bpg=">Dob Park Woods Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE195499&amp;z=126">Dob Park Wood</a></td>
				<td>Otley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE195499&amp;z=126">SE195499</a></td></tr><tr style="background-color: #FFF"><td>Sun 14/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74281&amp;bpg=">Thorndon North</a></td>
				<td>Regional</td>
				<td><a href="http://orienteering-havoc.co.uk" target="_blank">HAVOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ594915&amp;z=126">Thorndon Country Park (North)</a></td>
				<td>Brentwood</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ594915&amp;z=126">TQ594915</a></td></tr><tr style="background-color: #EEE"><td>Sun 14/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74380&amp;bpg=">QOFL 5</a></td>
				<td>Local</td>
				<td><a href="http://www.quantockorienteers.co.uk" target="_blank">QO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST246159&amp;z=126">Staplehill</a></td>
				<td>Taunton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST246159&amp;z=126">ST246159</a></td></tr><tr style="background-color: #FFF"><td>Sun 14/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74535&amp;bpg=">2019 Welsh League Event &amp; Yvette Baker trophy and Shield Qualifier &amp; Cwpan Y Ddraig Competition</a></td>
				<td>Regional</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NP4 5YG&amp;z=126">Cwm Lickey </a></td>
				<td>Cwmbran</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NP4 5YG&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 14/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75994&amp;bpg=">Sarum Urban event  </a></td>
				<td>Regional</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td>Tisbury</td>
				<td>Salisbury</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Mon 15/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76045&amp;bpg=">Spring Series</a></td>
				<td>Local</td>
				<td><a href="http://www.logonline.org.uk" target="_blank">LOG</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK918280&amp;z=126">Stoke Rochford</a></td>
				<td>Lincoln</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK918280&amp;z=126">SK918280</a></td></tr><tr style="background-color: #EEE"><td>Mon 15/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26437&amp;bpg=">BL Club Night, Castle Park</a></td>
				<td>Activity</td>
				<td><a href="http://www.bl-orienteering.org.uk/" target="_blank">BL</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CA11 7JQ&amp;z=126">Castle Park</a></td>
				<td>Penrith</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CA11 7JQ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Mon 15/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26723&amp;bpg=">Monday Night Club     </a></td>
				<td>Activity</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LE67 9TB&amp;z=126">South Charnwood High School</a></td>
				<td>Leicester</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LE67 9TB&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 16/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75685&amp;bpg=">TVOC Oxford Street Series</a></td>
				<td>Local</td>
				<td><a href="http://www.tvoc.org.uk" target="_blank">TVOC</a></td>
				<td>SCOA</td>
				<td>Oxford</td>
				<td>Oxford</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Tue 16/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76195&amp;bpg=">MDOC Summer evening event</a></td>
				<td>Local</td>
				<td><a href="http://www.mdoc.org.uk" target="_blank">MDOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ949732&amp;z=126">Teggs Nose Country Park</a></td>
				<td>Macclesfield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ949732&amp;z=126">SJ949732</a></td></tr><tr style="background-color: #EEE"><td>Tue 16/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26870&amp;bpg=">Tuesday Hill Reps                                                           </a></td>
				<td>Activity</td>
				<td><a href="http://www.wessex-oc.org" target="_blank">WSX</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH12 5BB&amp;z=126">Bournemouth University</a></td>
				<td>Poole</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH12 5BB&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 17/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75080&amp;bpg=">Spring - O 1</a></td>
				<td>Local</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>Harrogate</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 17/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75205&amp;bpg=">STAG Spring 2</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS555621&amp;z=126">Pollok Country Park</a></td>
				<td>Glasgow</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS555621&amp;z=126">NS555621</a></td></tr><tr style="background-color: #FFF"><td>Wed 17/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75328&amp;bpg=">LOC Classic Series 3</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td>Holme Fell </td>
				<td>Ulverston</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 17/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75999&amp;bpg=">Poacher 2 - Osgoodby Woods</a></td>
				<td>Local</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Osgoodby Woods</td>
				<td>Market Rasen</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 17/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76054&amp;bpg=">Evening event</a></td>
				<td>Local</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK325950&amp;z=126">Wheata Woods</a></td>
				<td>Sheffield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK325950&amp;z=126">SK325950</a></td></tr><tr style="background-color: #EEE"><td>Wed 17/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26245&amp;bpg=">Club Night - Running Training</a></td>
				<td>Activity</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT6 9GL&amp;z=126">Connswater Greenway</a></td>
				<td>Belfast</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT6 9GL&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 17/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26567&amp;bpg=">Rossendale Club Night</a></td>
				<td>Activity</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB4 7SN&amp;z=126">Marl Pits Leisure Centre, Newchurch Road, Rawtenstall</a></td>
				<td>Rawtenstall</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB4 7SN&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 17/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26798&amp;bpg=">evening street activity</a></td>
				<td>Activity</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST5 3HY&amp;z=126"> morrisons car park</a></td>
				<td>Newcastle </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST5 3HY&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 17/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26930&amp;bpg=">Training Polmaise</a></td>
				<td>Activity</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=FK7 9NB&amp;z=126">Polmaise</a></td>
				<td>Cambusbarran</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=FK7 9NB&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Thu 18/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76015&amp;bpg=">Spring series 7, Woodhall</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Woodhall</td>
				<td>Cockermouth</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Fri 19/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71303&amp;bpg=">Jan Kjellstrom Orienteering Festival - Sprint (UKOL)</a></td>
				<td>Major</td>
				<td><a href="http://www.baoc.info/" target="_blank">BAOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU869525&amp;z=126">Aldershot Garrison</a></td>
				<td>Aldershot</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU869525&amp;z=126">SU869525</a></td></tr><tr style="background-color: #EEE"><td>Sat 20/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71304&amp;bpg=">Jan Kjellstrom Orienteering Festival - Individual 1 (UKOL)</a></td>
				<td>Major</td>
				<td><a href="https://www.southernnavigators.com/" target="_blank">SN</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU908586&amp;z=126">Windmill Hill</a></td>
				<td>Frimley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU908586&amp;z=126">SU908586</a></td></tr><tr style="background-color: #FFF"><td>Sun 21/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71305&amp;bpg=">Jan Kjellstrom Orienteering Festival - Individual 2 (UKOL)</a></td>
				<td>Major</td>
				<td><a href="http://www.bko.org.uk" target="_blank">BKO</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU519737&amp;z=126">Cold Ash</a></td>
				<td>Newbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU519737&amp;z=126">SU519737</a></td></tr><tr style="background-color: #EEE"><td>Sun 21/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75296&amp;bpg=">Tayside's &quot;Not the JK&quot;</a></td>
				<td>Local</td>
				<td><a href="http://taysideorienteers.org.uk" target="_blank">TAY</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO137201&amp;z=126">Moncreiffe Hill</a></td>
				<td>Perth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO137201&amp;z=126">NO137201</a></td></tr><tr style="background-color: #FFF"><td>Mon 22/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71306&amp;bpg=">Jan Kjellstrom Orienteering Festival - Relays</a></td>
				<td>Major</td>
				<td></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU827577&amp;z=126">Minley</a></td>
				<td>Fleet</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU827577&amp;z=126">SU827577</a></td></tr><tr style="background-color: #EEE"><td>Tue 23/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74874&amp;bpg=">MV Street O</a></td>
				<td>Local</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td>Ewell</td>
				<td>Ewell</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Tue 23/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26871&amp;bpg=">Tuesday Hill Reps                                                     </a></td>
				<td>Activity</td>
				<td><a href="http://www.wessex-oc.org" target="_blank">WSX</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH12 5BB&amp;z=126">Bournemouth University</a></td>
				<td>Poole</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH12 5BB&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 24/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75329&amp;bpg=">LOC Classic Series 4</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td>Bigland Woods </td>
				<td>Lake District</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 24/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75522&amp;bpg=">ELO SprintELOpe 1</a></td>
				<td>Local</td>
				<td><a href="http://www.elo.org.uk" target="_blank">ELO</a></td>
				<td>SOA</td>
				<td>tba</td>
				<td>tba</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 24/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75968&amp;bpg=">FVO WEE Hermitage Woods</a></td>
				<td>Local</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS809968&amp;z=126">Stirling University Hermitage Woods</a></td>
				<td>Bridge of Allan</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS809968&amp;z=126">NS809968</a></td></tr><tr style="background-color: #FFF"><td>Wed 24/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75984&amp;bpg=">BOK Urban Series 1</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST565758&amp;z=126">University Halls and Stoke Lodge</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST565758&amp;z=126">ST565758</a></td></tr><tr style="background-color: #EEE"><td>Wed 24/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76000&amp;bpg=">Poacher 3 - Twigmoor Woods</a></td>
				<td>Local</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Twigmoor Woods</td>
				<td>Scunthorpe</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 24/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76056&amp;bpg=">Aire Spring Sprint League  </a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE271365&amp;z=126">Beckett Park</a></td>
				<td>Leeds</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE271365&amp;z=126">SE271365</a></td></tr><tr style="background-color: #EEE"><td>Wed 24/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76118&amp;bpg=">RR Sprint Series 1</a></td>
				<td>Local</td>
				<td><a href="http://roxburghreivers.org.uk" target="_blank">RR</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT730348&amp;z=126">Kelso Town</a></td>
				<td>Kelso</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT730348&amp;z=126">NT730348</a></td></tr><tr style="background-color: #FFF"><td>Wed 24/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26246&amp;bpg=">Club Night - Running Training</a></td>
				<td>Activity</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT6 9GL&amp;z=126">Connswater Greenway</a></td>
				<td>Belfast</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT6 9GL&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 24/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26383&amp;bpg=">STAG Postbox O - No.2</a></td>
				<td>Activity</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>Baillieston &amp; Garrowhill</td>
				<td>Glasgow </td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 24/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26568&amp;bpg=">Rossendale Club Night</a></td>
				<td>Activity</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB4 7SN&amp;z=126">Marl Pits Leisure Centre, Newchurch Road, Rawtenstall</a></td>
				<td>Rawtenstall</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB4 7SN&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 24/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26832&amp;bpg=">evening street activity</a></td>
				<td>Activity</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST7 4JA&amp;z=126">Bathpool Park North Car Park , ST7 4JA </a></td>
				<td>KIDSGROVE </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST7 4JA&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Thu 25/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76016&amp;bpg=">Spring series 8, Flat Fell</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Flat Fell</td>
				<td>Cleator</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 25/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76209&amp;bpg=">LOC Primary Schools Series 1</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD291771&amp;z=126">Ulverston Leisure Centre</a></td>
				<td>Ulverston</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD291771&amp;z=126">SD291771</a></td></tr><tr style="background-color: #FFF"><td>Fri 26/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26922&amp;bpg=">Sutton Coldfield Accessibility Games</a></td>
				<td>Activity</td>
				<td><a href="http://www.coboc.org.uk" target="_blank">COBOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=B74 2NW&amp;z=126">Birmingham Metropolitan College - Sutton Coldfield Campus</a></td>
				<td>Sutton Coldfield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=B74 2NW&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 27/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=69068&amp;bpg=">Tio Mila 27-28 April</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Sweden</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 27/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74896&amp;bpg=">ParkO- Lammas Land and Coe Fen</a></td>
				<td>Local</td>
				<td><a href="http://www.waoc.org.uk" target="_blank">WAOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CB2 7AD&amp;z=126">Lammas Land and Coe Fen</a></td>
				<td>Newnham, Cambridge</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CB2 7AD&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 27/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75002&amp;bpg=">Beginners, Families and Schools Events</a></td>
				<td>Local</td>
				<td><a href="http://www.coboc.org.uk" target="_blank">COBOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP032916&amp;z=126">Hilltop</a></td>
				<td>West Bromwich</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP032916&amp;z=126">SP032916</a></td></tr><tr style="background-color: #FFF"><td>Sat 27/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75222&amp;bpg=">ELO Local Events in Edinburgh and the Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.elo.org.uk" target="_blank">ELO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT376632&amp;z=126">Vogrie Country Park</a></td>
				<td>Gorebridge</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT376632&amp;z=126">NT376632</a></td></tr><tr style="background-color: #EEE"><td>Sat 27/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75553&amp;bpg=">DFOK KOL 8</a></td>
				<td>Local</td>
				<td><a href="http://www.dfok.co.uk" target="_blank">DFOK</a></td>
				<td>SEOA</td>
				<td>Lullingstone</td>
				<td>Eynsford</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 27/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75776&amp;bpg=">SROC spring series event 2</a></td>
				<td>Local</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PR4 4AT&amp;z=126">Duxbury park</a></td>
				<td>Preston</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PR4 4AT&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 27/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75800&amp;bpg=">SO SOG S8 - Worthlodge Forest, Crawley</a></td>
				<td>Local</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>Worthlodge</td>
				<td>Crawley</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 27/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75819&amp;bpg=">MOR Saturday &amp; Schools League- Millbuies</a></td>
				<td>Local</td>
				<td><a href="http://www.moravianorienteering.org" target="_blank">MOR</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ188693&amp;z=126">TBN</a></td>
				<td>Elgin</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ188693&amp;z=126">NJ188693</a></td></tr><tr style="background-color: #EEE"><td>Sat 27/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75832&amp;bpg=">Wessex Region Summer Series and League</a></td>
				<td>Local</td>
				<td><a href="http://southampton-orienteers.org.uk" target="_blank">SOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU460160&amp;z=126">Itchen Valley Country Park</a></td>
				<td>Southampton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU460160&amp;z=126">SU460160</a></td></tr><tr style="background-color: #FFF"><td>Sat 27/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75852&amp;bpg=">SBOC - Coaching for newcomers no 4</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Clyne Valley Country Park</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 27/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76163&amp;bpg=">Explore the Parks</a></td>
				<td>Local</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>Rushcliffe Country Park</td>
				<td>Nottingham</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 27/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76310&amp;bpg=">Saturday Series 7</a></td>
				<td>Local</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK413842&amp;z=126">Shire Brook Valley</a></td>
				<td>Sheffield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK413842&amp;z=126">SK413842</a></td></tr><tr style="background-color: #EEE"><td>Sat 27/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26906&amp;bpg=">SBOC - Coaching for newcomers no 4 </a></td>
				<td>Activity</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SA2 8DU&amp;z=126">Clyne Valley Country Park</a></td>
				<td>Swansea</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SA2 8DU&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 27/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26918&amp;bpg=">Club Coaching &amp; Chelmsford Spring Into Action Come and Try Orienteering</a></td>
				<td>Activity</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CM3 4JJ&amp;z=126">Danbury Common</a></td>
				<td>Chelmsford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CM3 4JJ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 28/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73731&amp;bpg=">YHOA Superleague and Yvette Baker Trophy Heat</a></td>
				<td>Regional</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Mausoleum Woods &amp; Cottagers Dale Wood</td>
				<td>Brigg</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 28/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74150&amp;bpg=">BOK Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST856897&amp;z=126">Westonbirt</a></td>
				<td>Tetbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST856897&amp;z=126">ST856897</a></td></tr><tr style="background-color: #EEE"><td>Sun 28/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74181&amp;bpg=">Forest League 8</a></td>
				<td>Regional</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SW983692&amp;z=126">Hustyn</a></td>
				<td>Wadebridge</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SW983692&amp;z=126">SW983692</a></td></tr><tr style="background-color: #FFF"><td>Sun 28/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74692&amp;bpg=">MDOC  Middle Distance Urban</a></td>
				<td>Regional</td>
				<td><a href="http://www.mdoc.org.uk" target="_blank">MDOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ650911&amp;z=126">Birchwood, including a new area.</a></td>
				<td>Warrington</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ650911&amp;z=126">SJ650911</a></td></tr><tr style="background-color: #EEE"><td>Sun 28/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74759&amp;bpg=">SAX Regional</a></td>
				<td>Regional</td>
				<td><a href="http://www.saxons-oc.org" target="_blank">SAX</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ582557&amp;z=126">Ightham</a></td>
				<td>Borough Green</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ582557&amp;z=126">TQ582557</a></td></tr><tr style="background-color: #FFF"><td>Sun 28/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74918&amp;bpg=">Cumbrian Galoppen - Muncaster Fell</a></td>
				<td>Regional</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD097967&amp;z=126">Muncaster Fell</a></td>
				<td>Ravenglass</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD097967&amp;z=126">SD097967</a></td></tr><tr style="background-color: #EEE"><td>Sun 28/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75189&amp;bpg=">Mousehold Heath,Norwich</a></td>
				<td>Regional</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TG236101&amp;z=126">Mousehold Heath</a></td>
				<td>Norwich</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TG236101&amp;z=126">TG236101</a></td></tr><tr style="background-color: #FFF"><td>Sun 28/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75200&amp;bpg=">Morpeth Gathering</a></td>
				<td>Local</td>
				<td><a href="http://www.newcastleorienteering.org.uk" target="_blank">NATO</a></td>
				<td>NEOA</td>
				<td>Morpeth</td>
				<td>Morpeth</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 28/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75689&amp;bpg=">Maroc Regional Event - Coull</a></td>
				<td>Regional</td>
				<td><a href="http://www.marocscotland.org.uk" target="_blank">MAROC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ab31 4dd&amp;z=126">Coull</a></td>
				<td>Aboyne</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ab31 4dd&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Mon 29/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75951&amp;bpg=">LEI Summer League 1</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK537130&amp;z=126">Swithland Woods</a></td>
				<td>Loughborough</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK537130&amp;z=126">SK537130</a></td></tr><tr style="background-color: #EEE"><td>Mon 29/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76040&amp;bpg=">Spring Series</a></td>
				<td>Local</td>
				<td><a href="http://www.logonline.org.uk" target="_blank">LOG</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK981756&amp;z=126">Riseholme</a></td>
				<td>Lincoln</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK981756&amp;z=126">SK981756</a></td></tr><tr style="background-color: #FFF"><td>Tue 30/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76119&amp;bpg=">RR Sprint Series 2</a></td>
				<td>Local</td>
				<td><a href="http://roxburghreivers.org.uk" target="_blank">RR</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT328353&amp;z=126">Traquair House</a></td>
				<td>Innerleithen</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT328353&amp;z=126">NT328353</a></td></tr><tr style="background-color: #EEE"><td>Tue 30/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76394&amp;bpg=">NWO Summer Street O Series</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU201924&amp;z=126">Highworth</a></td>
				<td>Highworth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU201924&amp;z=126">SU201924</a></td></tr><tr style="background-color: #FFF"><td>Tue 30/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26358&amp;bpg=">Track to Terrain Coaching Session 1</a></td>
				<td>Activity</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BS41 9LX&amp;z=126">Ashton Court</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BS41 9LX&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 30/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26872&amp;bpg=">Tuesday Hill Reps                                          </a></td>
				<td>Activity</td>
				<td><a href="http://www.wessex-oc.org" target="_blank">WSX</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH12 5BB&amp;z=126">Bournemouth University</a></td>
				<td>Poole</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH12 5BB&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 30/04/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26896&amp;bpg=">PFO Towneley Park Series 1 of 4</a></td>
				<td>Activity</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB11 3RQ&amp;z=126">Towneley Park near Rotunda Cafe</a></td>
				<td>Burnley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB11 3RQ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 01/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75081&amp;bpg=">Spring - O 2</a></td>
				<td>Local</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td></td>
				<td></td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 01/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75204&amp;bpg=">STAG Spring 3</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS803546&amp;z=126">Greenhead Moss</a></td>
				<td>Wishaw</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS803546&amp;z=126">NS803546</a></td></tr><tr style="background-color: #EEE"><td>Wed 01/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75330&amp;bpg=">LOC Classic Series 5</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td>Boo Tarn </td>
				<td>Coniston</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 01/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75499&amp;bpg=">OD Summer Evening Event - St Nicholas Park</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP286649&amp;z=126">St Nicholas Park, Warwick</a></td>
				<td>Warwick</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP286649&amp;z=126">SP286649</a></td></tr><tr style="background-color: #EEE"><td>Wed 01/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75853&amp;bpg=">SBOC -Summer League 1</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Singleton Park</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 01/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75969&amp;bpg=">FVO WEE Abbey Craig</a></td>
				<td>Local</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS806956&amp;z=126">Abbey Craig</a></td>
				<td>Bridge of Allan</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS806956&amp;z=126">NS806956</a></td></tr><tr style="background-color: #EEE"><td>Wed 01/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75985&amp;bpg=">BOK Urban Series 2</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST466697&amp;z=126">Nailsea</a></td>
				<td>Nailsea</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST466697&amp;z=126">ST466697</a></td></tr><tr style="background-color: #FFF"><td>Wed 01/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76001&amp;bpg=">Poacher 4 - Hendale</a></td>
				<td>Local</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Hendale</td>
				<td>Great Limber</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 01/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76057&amp;bpg=">Aire Spring Sprint League  </a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE175309&amp;z=126">Bowling Park</a></td>
				<td>Bradford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE175309&amp;z=126">SE175309</a></td></tr><tr style="background-color: #FFF"><td>Wed 01/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76074&amp;bpg=">Summer Evening Event- Linmere</a></td>
				<td>Local</td>
				<td><a href="http://www.deeside-orienteering-club.org.uk" target="_blank">DEE</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ549704&amp;z=126">Delamere Forest Linmere</a></td>
				<td>Frodsham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ549704&amp;z=126">SJ549704</a></td></tr><tr style="background-color: #EEE"><td>Wed 01/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76252&amp;bpg=">Craigmonie </a></td>
				<td>Local</td>
				<td><a href="http://www.invoc.org.uk" target="_blank">INVOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV63 6XA&amp;z=126">Craigmonie</a></td>
				<td>Drumnadrochit</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV63 6XA&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Thu 02/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76172&amp;bpg=">Summer series 1</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Lodore, Borrowdale</td>
				<td>Keswick</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 02/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76210&amp;bpg=">LOC Primary Schools Series 2</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD380868&amp;z=126">Fell Foot Park</a></td>
				<td>Newby Bridge</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD380868&amp;z=126">SD380868</a></td></tr><tr style="background-color: #FFF"><td>Fri 03/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75433&amp;bpg=">Irish Champs Day 1 Sprint</a></td>
				<td>Regional</td>
				<td><a href="https://fermoblog.wordpress.com/" target="_blank">FERMO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT92 1DB&amp;z=126">Florencecourt National Trust </a></td>
				<td>Florencecourt Co Fermanagh BT92 1DB</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT92 1DB&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 04/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71309&amp;bpg=">British Championships Weekend Mixed Sprint Relays</a></td>
				<td>National</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE153328&amp;z=126">University of Bradford</a></td>
				<td>Bradford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE153328&amp;z=126">SE153328</a></td></tr><tr style="background-color: #FFF"><td>Sat 04/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75434&amp;bpg=">Irish Champs Day 2 Middle</a></td>
				<td>Regional</td>
				<td><a href="https://fermoblog.wordpress.com/" target="_blank">FERMO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT94 1PP&amp;z=126">Castle Archdale</a></td>
				<td>Irvinestown</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT94 1PP&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 05/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71307&amp;bpg=">British Orienteering Championships (UKOL)</a></td>
				<td>Major</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD933716&amp;z=126">Kilnsey North &amp; Arncliffe</a></td>
				<td>Grassington</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD933716&amp;z=126">SD933716</a></td></tr><tr style="background-color: #FFF"><td>Sun 05/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74031&amp;bpg=">WSX Galoppen</a></td>
				<td>Regional</td>
				<td><a href="http://www.wessex-oc.org" target="_blank">WSX</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST957201&amp;z=126">Rushmore</a></td>
				<td>Shaftesbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST957201&amp;z=126">ST957201</a></td></tr><tr style="background-color: #EEE"><td>Sun 05/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75435&amp;bpg=">Irish Champs Day 3 Long</a></td>
				<td>Regional</td>
				<td><a href="https://fermoblog.wordpress.com/" target="_blank">FERMO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT92 1ED&amp;z=126">The Cavan Burren</a></td>
				<td>Belcoo</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT92 1ED&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 05/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76298&amp;bpg=">Parkhurst Forest</a></td>
				<td>Local</td>
				<td><a href="http://wight-orienteers.co.uk" target="_blank">WIGHTO</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SZ481900&amp;z=126">Parkhurst Forest</a></td>
				<td>Newport</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SZ481900&amp;z=126">SZ481900</a></td></tr><tr style="background-color: #EEE"><td>Sun 05/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76411&amp;bpg=">Devon League Event 6</a></td>
				<td>Local</td>
				<td><a href="http://www.devonorienteering.co.uk" target="_blank">DEVON</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=EX5 3LE&amp;z=126">Ashclyst Forest</a></td>
				<td>Exeter</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=EX5 3LE&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Mon 06/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71308&amp;bpg=">British Relay Championships</a></td>
				<td>Major</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td>Middleton Park</td>
				<td>Leeds</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Mon 06/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75436&amp;bpg=">Irish Champs Day 4 Relay</a></td>
				<td>Regional</td>
				<td><a href="https://fermoblog.wordpress.com/" target="_blank">FERMO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT70 3PQ&amp;z=126">Parkanur</a></td>
				<td>Dungannon</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT70 3PQ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 07/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75041&amp;bpg=">SROC summer sprint 1</a></td>
				<td>Local</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LA1 1UX&amp;z=126">Williamson Park</a></td>
				<td>Lancaster</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LA1 1UX&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 07/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75916&amp;bpg=">MV Summer Series</a></td>
				<td>Local</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SM3 8AB&amp;z=126">Nonsuch Park</a></td>
				<td>Cheam</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SM3 8AB&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 07/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76286&amp;bpg=">Summer 2019 Street O Series</a></td>
				<td>Local</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SG12 9XF&amp;z=126">Burgage Lane, Ware, SG12 9XF</a></td>
				<td>Ware</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SG12 9XF&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 07/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76353&amp;bpg=">Wrekin Summer Series 1</a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ694050&amp;z=126">Madeley Court </a></td>
				<td>Telford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ694050&amp;z=126">SJ694050</a></td></tr><tr style="background-color: #FFF"><td>Tue 07/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26359&amp;bpg=">Track to Terrain Coaching Session 2</a></td>
				<td>Activity</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BS41 9LX&amp;z=126">Ashton Court</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BS41 9LX&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 07/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26897&amp;bpg=">PFO Towneley Park Series 2 of 4</a></td>
				<td>Activity</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB11 3RQ&amp;z=126">Towneley Park by Rotunda Cafe</a></td>
				<td>Burnley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB11 3RQ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 08/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75484&amp;bpg=">WEE 1</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 08/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75500&amp;bpg=">OD Summer Evening Event - Elmdon Park</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP161828&amp;z=126">Elmdon Park</a></td>
				<td>Solihull</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP161828&amp;z=126">SP161828</a></td></tr><tr style="background-color: #FFF"><td>Wed 08/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75523&amp;bpg=">ELO SprintELOpe 2</a></td>
				<td>Local</td>
				<td><a href="http://www.elo.org.uk" target="_blank">ELO</a></td>
				<td>SOA</td>
				<td>tba</td>
				<td>tba</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 08/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75970&amp;bpg=">FVO WEE Fallin</a></td>
				<td>Local</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS837915&amp;z=126">Fallin</a></td>
				<td>Fallin</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS837915&amp;z=126">NS837915</a></td></tr><tr style="background-color: #FFF"><td>Wed 08/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75986&amp;bpg=">BOK Urban Series 3</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST746651&amp;z=126">City of Bath</a></td>
				<td>Bath</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST746651&amp;z=126">ST746651</a></td></tr><tr style="background-color: #EEE"><td>Wed 08/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76002&amp;bpg=">Poacher 5 - Swallow Dale Woods (Pillar)</a></td>
				<td>Local</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Caistor</td>
				<td>Caistor</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 08/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76058&amp;bpg=">Aire Spring Sprint League </a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE057420&amp;z=126">Cliffe Castle &amp; Devonshire Park</a></td>
				<td>Keighley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE057420&amp;z=126">SE057420</a></td></tr><tr style="background-color: #EEE"><td>Wed 08/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76120&amp;bpg=">RR Sprint Series 3</a></td>
				<td>Local</td>
				<td><a href="http://roxburghreivers.org.uk" target="_blank">RR</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT639218&amp;z=126">Lanton Woods</a></td>
				<td>Jedburgh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT639218&amp;z=126">NT639218</a></td></tr><tr style="background-color: #FFF"><td>Wed 08/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76386&amp;bpg=">Cardiff Park Series 1</a></td>
				<td>Local</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CF14 4EN&amp;z=126">Heath Park</a></td>
				<td>Cardiff</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CF14 4EN&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 08/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26384&amp;bpg=">STAG Postbox O - No.3</a></td>
				<td>Activity</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>TBC</td>
				<td>Glasgow </td>
				<td></td></tr><tr style="background-color: #FFF"><td>Thu 09/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75952&amp;bpg=">LEI Summer League 2</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK298173&amp;z=126">Tunnel Woods</a></td>
				<td>Ashby de la Zouch</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK298173&amp;z=126">SK298173</a></td></tr><tr style="background-color: #EEE"><td>Thu 09/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76065&amp;bpg=">Thursday Evening One 2019</a></td>
				<td>Local</td>
				<td><a href="http://www.nwoc.info" target="_blank">NWOC</a></td>
				<td>NIOA</td>
				<td></td>
				<td>Limavady</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Thu 09/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76075&amp;bpg=">Summer Evening Event Delamere East</a></td>
				<td>Local</td>
				<td><a href="http://www.deeside-orienteering-club.org.uk" target="_blank">DEE</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ558710&amp;z=126">Delamere east</a></td>
				<td>Frodsham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ558710&amp;z=126">SJ558710</a></td></tr><tr style="background-color: #EEE"><td>Thu 09/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76173&amp;bpg=">Summer series 2</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>High Rigg</td>
				<td>Keswick</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Thu 09/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76192&amp;bpg=">MDOC Introductory Event (1)   </a></td>
				<td>Local</td>
				<td><a href="http://www.mdoc.org.uk" target="_blank">MDOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ964823&amp;z=126">Lyme </a></td>
				<td>Disley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ964823&amp;z=126">SJ964823</a></td></tr><tr style="background-color: #EEE"><td>Thu 09/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76211&amp;bpg=">LOC Primary Schools Series 3</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD376788&amp;z=126">Cartmel Racecourse</a></td>
				<td>Cartmel</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD376788&amp;z=126">SD376788</a></td></tr><tr style="background-color: #FFF"><td>Sat 11/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74763&amp;bpg=">HH Saturday League</a></td>
				<td>Local</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td>Stanborough Lakes</td>
				<td>Welwyn Garden City</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 11/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74912&amp;bpg=">Hallin Fell Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.bl-orienteering.org.uk/" target="_blank">BL</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY436192&amp;z=126">Hallin Fell, Nr Pooley Bridge</a></td>
				<td>Penrith</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY436192&amp;z=126">NY436192</a></td></tr><tr style="background-color: #FFF"><td>Sat 11/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74947&amp;bpg=">NGOC League 5</a></td>
				<td>Regional</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO949189&amp;z=126">Leckhampton Hill</a></td>
				<td>Cheltenham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO949189&amp;z=126">SO949189</a></td></tr><tr style="background-color: #EEE"><td>Sat 11/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75383&amp;bpg=">WM Schools Hednesford Camp</a></td>
				<td>Local</td>
				<td><a href="http://www.walton-chasers.co.uk" target="_blank">WCH</a></td>
				<td>WMOA</td>
				<td>Hednesford Camp</td>
				<td>Stafford</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 11/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75733&amp;bpg=">PFO event and Yvette Baker Trophy Heat</a></td>
				<td>Regional</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB12 9JT&amp;z=126">Aitken Woods</a></td>
				<td>Nelson</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB12 9JT&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 11/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75753&amp;bpg=">DFOK NW Kent 3</a></td>
				<td>Local</td>
				<td><a href="http://www.dfok.co.uk" target="_blank">DFOK</a></td>
				<td>SEOA</td>
				<td>Shooters Hill Woodland</td>
				<td>Eltham</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 11/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75799&amp;bpg=">SO SOG S9/Chasing</a></td>
				<td>Local</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>Knowlands Wood &amp; Barcombe</td>
				<td>tbc</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 11/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76063&amp;bpg=">Aire Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE402488&amp;z=126">Wetherby Parklands</a></td>
				<td>Wetherby</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE402488&amp;z=126">SE402488</a></td></tr><tr style="background-color: #FFF"><td>Sat 11/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76126&amp;bpg=">Summer Series 1</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TR14 0HA&amp;z=126">Tehidy Country Park</a></td>
				<td>Camborne</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TR14 0HA&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 11/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76220&amp;bpg=">Wessex Summer series Score event (draft)</a></td>
				<td>Local</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td>Fonthill</td>
				<td>Fonthill</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 11/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76370&amp;bpg=">SEE Himley - HOC SEE League</a></td>
				<td>Local</td>
				<td><a href="http://www.harlequins.org.uk" target="_blank">HOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO889914&amp;z=126">Himley Hall</a></td>
				<td>Kingswinford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO889914&amp;z=126">SO889914</a></td></tr><tr style="background-color: #EEE"><td>Sun 12/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74151&amp;bpg=">BOK Regional Event (Galoppen)</a></td>
				<td>Regional</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST421571&amp;z=126">Wavering Down</a></td>
				<td>Winscombe</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST421571&amp;z=126">ST421571</a></td></tr><tr style="background-color: #FFF"><td>Sun 12/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74404&amp;bpg=">Regional Event and YHOA School Championships</a></td>
				<td>Regional</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK433900&amp;z=126">Canklow Woods</a></td>
				<td>Sheffield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK433900&amp;z=126">SK433900</a></td></tr><tr style="background-color: #EEE"><td>Sun 12/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74536&amp;bpg=">2019 Welsh League Event &amp; All Wales Scout Championships </a></td>
				<td>Regional</td>
				<td><a href="http://www.mid-wales-orienteers.org.uk" target="_blank">MWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO079541&amp;z=126">Carneddau</a></td>
				<td>Builth Wells</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO079541&amp;z=126">SO079541</a></td></tr><tr style="background-color: #FFF"><td>Sun 12/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74616&amp;bpg=">South East Relays</a></td>
				<td>Regional</td>
				<td><a href="http://www.londonorienteering.co.uk" target="_blank">LOK</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ354642&amp;z=126">Addington Hills</a></td>
				<td>Croydon</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ354642&amp;z=126">TQ354642</a></td></tr><tr style="background-color: #EEE"><td>Sun 12/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74831&amp;bpg=">SOS Maldon Urban</a></td>
				<td>Regional</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TL860064&amp;z=126">Maldon Town &amp; Prom Park</a></td>
				<td>Maldon, Essex</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TL860064&amp;z=126">TL860064</a></td></tr><tr style="background-color: #FFF"><td>Sun 12/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74863&amp;bpg=">East Midlands Urban League 2019</a></td>
				<td>Regional</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>Clifton</td>
				<td>Nottingham</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 12/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74953&amp;bpg=">Regional event</a></td>
				<td>Regional</td>
				<td><a href="http://www.clok.org.uk" target="_blank">CLOK</a></td>
				<td>NEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ524029&amp;z=126">Cringle and Cold Moors</a></td>
				<td>Stokesley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ524029&amp;z=126">NZ524029</a></td></tr><tr style="background-color: #FFF"><td>Sun 12/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75138&amp;bpg=">Keyne-O, Caldecotte Lake</a></td>
				<td>Local</td>
				<td><a href="http://www.smoc.info" target="_blank">SMOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=MK7 8HP&amp;z=126">Caldecotte Lake</a></td>
				<td>Milton Keynes</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=MK7 8HP&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 12/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75169&amp;bpg=">BKO Regional Event SCOL6 (Rushall Woods)</a></td>
				<td>Regional</td>
				<td><a href="http://www.bko.org.uk" target="_blank">BKO</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU576733&amp;z=126">Rushall Woods</a></td>
				<td>Bradfield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU576733&amp;z=126">SU576733</a></td></tr><tr style="background-color: #FFF"><td>Sun 12/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75263&amp;bpg=">WMOA League Event  7  Parkhall </a></td>
				<td>Regional</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ930446&amp;z=126">parkhall country park</a></td>
				<td>Longton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ930446&amp;z=126">SJ930446</a></td></tr><tr style="background-color: #EEE"><td>Mon 13/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76041&amp;bpg=">Spring Series</a></td>
				<td>Local</td>
				<td><a href="http://www.logonline.org.uk" target="_blank">LOG</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK977698&amp;z=126">South Common</a></td>
				<td>Lincoln</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK977698&amp;z=126">SK977698</a></td></tr><tr style="background-color: #FFF"><td>Mon 13/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76383&amp;bpg=">WIM/WSX Monthly Evening event - Ashley Heath near Ringwood</a></td>
				<td>Local</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH24 2PG&amp;z=126">Ashley Heath estate</a></td>
				<td>Ringwood</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH24 2PG&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Mon 13/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26438&amp;bpg=">BL Club Night, Penrith</a></td>
				<td>Activity</td>
				<td><a href="http://www.bl-orienteering.org.uk/" target="_blank">BL</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CA11 8RQ&amp;z=126">Penrith Rugby Club</a></td>
				<td>Penrith</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CA11 8RQ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 14/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75953&amp;bpg=">LEI Summer League 3</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK425093&amp;z=126">Grange and Battram Woods</a></td>
				<td>Coalville</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK425093&amp;z=126">SK425093</a></td></tr><tr style="background-color: #EEE"><td>Tue 14/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76121&amp;bpg=">RR Sprint Series 4</a></td>
				<td>Local</td>
				<td><a href="http://roxburghreivers.org.uk" target="_blank">RR</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT476286&amp;z=126">Selkirk Hill</a></td>
				<td>Selkirk</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT476286&amp;z=126">NT476286</a></td></tr><tr style="background-color: #FFF"><td>Tue 14/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76219&amp;bpg=">MDOC Summer Evening Event</a></td>
				<td>Local</td>
				<td><a href="http://www.mdoc.org.uk" target="_blank">MDOC</a></td>
				<td>NWOA</td>
				<td>Macclesfield Forest</td>
				<td>Macclesfield</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Tue 14/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76287&amp;bpg=">Summer 2019 Street O Series </a></td>
				<td>Local</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SG14 1QN&amp;z=126">Hartham Lane, Hertford, SG14 1QN</a></td>
				<td>Hertford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SG14 1QN&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 14/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76354&amp;bpg=">Wrekin Summer Series 2</a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ698078&amp;z=126">Telford Town Park </a></td>
				<td>Telford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ698078&amp;z=126">SJ698078</a></td></tr><tr style="background-color: #EEE"><td>Tue 14/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76389&amp;bpg=">Street O Series Race 9</a></td>
				<td>Local</td>
				<td><a href="http://slow.org.uk/" target="_blank">SLOW</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=KT2 7QE&amp;z=126"></a></td>
				<td>Wandsworth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=KT2 7QE&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 14/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26360&amp;bpg=">Track to Terrain Coaching Session 3</a></td>
				<td>Activity</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BS8 3PZ&amp;z=126">Leigh Woods</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BS8 3PZ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 14/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26898&amp;bpg=">PFO Towneley Park Series 3 of 4</a></td>
				<td>Activity</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB11 3RQ&amp;z=126">Towneley Park by Rotunda Cafe</a></td>
				<td>Burnley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB11 3RQ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 15/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74932&amp;bpg=">ESOC Local Events in Edinburgh and the Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT281731&amp;z=126">Holyrood Park</a></td>
				<td>Edinburgh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT281731&amp;z=126">NT281731</a></td></tr><tr style="background-color: #EEE"><td>Wed 15/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75082&amp;bpg=">Spring - O 3</a></td>
				<td>Local</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td></td>
				<td></td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 15/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75207&amp;bpg=">STAG Spring 4 - WOW1!</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS578624&amp;z=126">Queen's Park</a></td>
				<td>Glasgow</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS578624&amp;z=126">NS578624</a></td></tr><tr style="background-color: #EEE"><td>Wed 15/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75485&amp;bpg=">WEE 2 - World Orienteering Day</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 15/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75502&amp;bpg=">OD Summer Evening Event - Abbey Fields and Kenilworth Urban - World Orienteering Day</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP287723&amp;z=126">Abbey Fields</a></td>
				<td>Kenilworth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP287723&amp;z=126">SP287723</a></td></tr><tr style="background-color: #EEE"><td>Wed 15/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75854&amp;bpg=">SBOC - Summer League 2</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Cefn Bryn (west)</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 15/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75971&amp;bpg=">FVO WEE Dunblane West</a></td>
				<td>Local</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN771007&amp;z=126">Dunblane West</a></td>
				<td>Dunblane</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN771007&amp;z=126">NN771007</a></td></tr><tr style="background-color: #EEE"><td>Wed 15/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75972&amp;bpg=">FVO WEE Linlithgow Loch</a></td>
				<td>Local</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS997771&amp;z=126">Linlithgow Loch</a></td>
				<td>Linlithgow</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS997771&amp;z=126">NS997771</a></td></tr><tr style="background-color: #FFF"><td>Wed 15/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75987&amp;bpg=">BOK Urban Series 4</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST848570&amp;z=126">Trowbridge South</a></td>
				<td>Trowbridge</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST848570&amp;z=126">ST848570</a></td></tr><tr style="background-color: #EEE"><td>Wed 15/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76003&amp;bpg=">Poacher 6 - Willingham Woods</a></td>
				<td>Local</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Market Rasen</td>
				<td>Market Rasen</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 15/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76059&amp;bpg=">Aire Spring Sprint League </a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE114396&amp;z=126">Gilstead Edge and Prince of Wales Park</a></td>
				<td>Bingley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE114396&amp;z=126">SE114396</a></td></tr><tr style="background-color: #EEE"><td>Wed 15/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76253&amp;bpg=">Evanton</a></td>
				<td>Local</td>
				<td><a href="http://www.invoc.org.uk" target="_blank">INVOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV16 9XR&amp;z=126">Evanton Woods</a></td>
				<td>Evanton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV16 9XR&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 15/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76311&amp;bpg=">Evening event for World Orienteering day</a></td>
				<td>Local</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK326880&amp;z=126">Bole Hill, Crookes</a></td>
				<td>Sheffield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK326880&amp;z=126">SK326880</a></td></tr><tr style="background-color: #EEE"><td>Wed 15/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76400&amp;bpg=">GO WOD Evening event</a></td>
				<td>Local</td>
				<td><a href="http://www.guildfordorienteers.co.uk" target="_blank">GO</a></td>
				<td>SEOA</td>
				<td>Blackheath?</td>
				<td>Guildford</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Thu 16/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76066&amp;bpg=">Thursday Evening Two 2019</a></td>
				<td>Local</td>
				<td><a href="http://www.nwoc.info" target="_blank">NWOC</a></td>
				<td>NIOA</td>
				<td></td>
				<td>Limavady</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 16/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76174&amp;bpg=">Summer series 3</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Sale Fell</td>
				<td>Cockermouth</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 18/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72886&amp;bpg=">LOC National Event Weekend</a></td>
				<td>National</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td>Caw </td>
				<td>Lake District</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 18/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74375&amp;bpg=">QOFL6</a></td>
				<td>Local</td>
				<td><a href="http://www.quantockorienteers.co.uk" target="_blank">QO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST102083&amp;z=126">Blackborough North</a></td>
				<td>Cullompton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST102083&amp;z=126">ST102083</a></td></tr><tr style="background-color: #FFF"><td>Sat 18/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74617&amp;bpg=">SO &quot;Sunny Sussex&quot; Weekend (1 of 3 ) - Middle Distance - SW Rewell / Rewell Quarry</a></td>
				<td>Regional</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU982072&amp;z=126">SW Rewell / Rewell Quarry</a></td>
				<td>Arundel</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU982072&amp;z=126">SU982072</a></td></tr><tr style="background-color: #EEE"><td>Sat 18/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74618&amp;bpg=">SO &quot;Sunny Sussex&quot; Weekend (2 of 3 ) - Short Urban (early evening) event - Arundel</a></td>
				<td>Regional</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ013068&amp;z=126">Arundel town</a></td>
				<td>Arundel</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ013068&amp;z=126">TQ013068</a></td></tr><tr style="background-color: #FFF"><td>Sat 18/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74891&amp;bpg=">ParkO- Milton Country Park </a></td>
				<td>Local</td>
				<td><a href="http://www.waoc.org.uk" target="_blank">WAOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CB24 6AZ&amp;z=126">Milton Country Park</a></td>
				<td>Milton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CB24 6AZ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 18/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75003&amp;bpg=">Beginners, Families and Schools Events</a></td>
				<td>Local</td>
				<td><a href="http://www.coboc.org.uk" target="_blank">COBOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP128944&amp;z=126">New Hall Valley Country Park</a></td>
				<td>Sutton Coldfield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP128944&amp;z=126">SP128944</a></td></tr><tr style="background-color: #FFF"><td>Sat 18/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75152&amp;bpg=">Junior League 5</a></td>
				<td>Local</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td>Pinewoods</td>
				<td>Harrogate</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 18/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75175&amp;bpg=">Kent Orienteering League</a></td>
				<td>Local</td>
				<td><a href="http://www.saxons-oc.org" target="_blank">SAX</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ544540&amp;z=126">Knole Park</a></td>
				<td>Sevenoaks</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ544540&amp;z=126">TQ544540</a></td></tr><tr style="background-color: #FFF"><td>Sat 18/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75223&amp;bpg=">ELO Local Events in Edinburgh and the Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.elo.org.uk" target="_blank">ELO</a></td>
				<td>SOA</td>
				<td>tba</td>
				<td>tba</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 18/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75824&amp;bpg=">SWOC Summer Series 1 (SWOC League 5)</a></td>
				<td>Local</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO268167&amp;z=126">Sugarloaf West</a></td>
				<td>Abergavenny</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO268167&amp;z=126">SO268167</a></td></tr><tr style="background-color: #FFF"><td>Sat 18/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76231&amp;bpg=">MOR Saturday and Schools League - Dufftown</a></td>
				<td>Local</td>
				<td><a href="http://www.moravianorienteering.org" target="_blank">MOR</a></td>
				<td>SOA</td>
				<td></td>
				<td>Dufftown</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 18/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76259&amp;bpg=">Aire Local Event </a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE198414&amp;z=126">Nunroyd Park</a></td>
				<td>Guiseley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE198414&amp;z=126">SE198414</a></td></tr><tr style="background-color: #FFF"><td>Sun 19/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72034&amp;bpg=">SO &quot;Sunny Sussex&quot; Weekend (3 of 3 ) SE League Event - Angmering Park (west), Arundel</a></td>
				<td>National</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ049075&amp;z=126">Angmering Park Estate (west)</a></td>
				<td>Arundel</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ049075&amp;z=126">TQ049075</a></td></tr><tr style="background-color: #EEE"><td>Sun 19/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72471&amp;bpg=">LOC National Event Weekend </a></td>
				<td>National</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td>Stickle Pike </td>
				<td>Lake District</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 19/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74107&amp;bpg=">East Midlands League 2019 &amp; YBT Heat</a></td>
				<td>Regional</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK355240&amp;z=126">Calke Abbey</a></td>
				<td>Ticknall</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK355240&amp;z=126">SK355240</a></td></tr><tr style="background-color: #EEE"><td>Sun 19/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74741&amp;bpg=">STAG Score 4+ - WOW 2 !!</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS726579&amp;z=126">Strathclyde Country Park</a></td>
				<td>Motherwell</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS726579&amp;z=126">NS726579</a></td></tr><tr style="background-color: #FFF"><td>Sun 19/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74819&amp;bpg=">SWOA South-West Middle Distance Championships</a></td>
				<td>Regional</td>
				<td><a href="http://www.devonorienteering.co.uk" target="_blank">DEVON</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=EX33 2NU&amp;z=126">Braunton Burrows</a></td>
				<td>Braunton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=EX33 2NU&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 19/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75190&amp;bpg=">Kings Lynn Urban</a></td>
				<td>Regional</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td>Kings Lynn Town</td>
				<td>Kings Lynn</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 19/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75232&amp;bpg=">Druridge Bay Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.newcastleorienteering.org.uk" target="_blank">NATO</a></td>
				<td>NEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ271998&amp;z=126">Druridge Bay</a></td>
				<td>Amble</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ271998&amp;z=126">NZ271998</a></td></tr><tr style="background-color: #EEE"><td>Sun 19/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75876&amp;bpg=">Hornchurch local GLOSS-style</a></td>
				<td>Local</td>
				<td><a href="http://orienteering-havoc.co.uk" target="_blank">HAVOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ536849&amp;z=126">Hornchurch Country Park</a></td>
				<td>Hornchurch</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ536849&amp;z=126">TQ536849</a></td></tr><tr style="background-color: #FFF"><td>Sun 19/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75915&amp;bpg=">BASOC Local</a></td>
				<td>Local</td>
				<td><a href="http://www.basoc.org.uk/" target="_blank">BASOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN727996&amp;z=126">Highland Folk Museum</a></td>
				<td>Newtonmore</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN727996&amp;z=126">NN727996</a></td></tr><tr style="background-color: #EEE"><td>Sun 19/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76023&amp;bpg=">OCOUL 2</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT61 9DJ&amp;z=126">Co Armagh - TBC</a></td>
				<td>Armagh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT61 9DJ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Mon 20/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76042&amp;bpg=">Spring Series</a></td>
				<td>Local</td>
				<td><a href="http://www.logonline.org.uk" target="_blank">LOG</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TF216628&amp;z=126">Ostlers Plantation</a></td>
				<td>Woodhall Spa</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TF216628&amp;z=126">TF216628</a></td></tr><tr style="background-color: #EEE"><td>Mon 20/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26843&amp;bpg=">Junior Training  </a></td>
				<td>Activity</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP1 3UZ&amp;z=126">Arts Centre, Salisbury</a></td>
				<td>Salisbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP1 3UZ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Mon 20/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26928&amp;bpg=">Uniformed Organisations' Activity</a></td>
				<td>Activity</td>
				<td><a href="http://www.tintoorienteers.org/" target="_blank">TINTO</a></td>
				<td>SOA</td>
				<td>Castlebank Park, Lanark</td>
				<td>LANARK</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Tue 21/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75042&amp;bpg=">SROC summer sprint 2</a></td>
				<td>Local</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LA1 5JS&amp;z=126">Salt Ayre</a></td>
				<td>Lancaster</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LA1 5JS&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 21/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75555&amp;bpg=">DFOK Park Race Series</a></td>
				<td>Local</td>
				<td><a href="http://www.dfok.co.uk" target="_blank">DFOK</a></td>
				<td>SEOA</td>
				<td>Danson Park</td>
				<td>Welling</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Tue 21/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75917&amp;bpg=">MV Summer Series</a></td>
				<td>Local</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SM3 8AB&amp;z=126">Nonsuch Park</a></td>
				<td>Cheam</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SM3 8AB&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 21/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76039&amp;bpg=">TAY World Orienteering Day Event</a></td>
				<td>Local</td>
				<td><a href="http://taysideorienteers.org.uk" target="_blank">TAY</a></td>
				<td>SOA</td>
				<td>Knock Hill</td>
				<td>Crieff</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Tue 21/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76193&amp;bpg=">MDOC Introductory Event (2)   </a></td>
				<td>Local</td>
				<td><a href="http://www.mdoc.org.uk" target="_blank">MDOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ964823&amp;z=126">Lyme </a></td>
				<td>Disley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ964823&amp;z=126">SJ964823</a></td></tr><tr style="background-color: #FFF"><td>Tue 21/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76288&amp;bpg=">Summer 2019 Street O Series </a></td>
				<td>Local</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=AL7 2RT&amp;z=126">Moneyhole Lane Car Park, Panshanger AL7 2RT</a></td>
				<td>Welwyn Garden City</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=AL7 2RT&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 21/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76355&amp;bpg=">Wrekin Summer Series 3</a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ723198&amp;z=126">Edgmond Hall and Village </a></td>
				<td>Newport</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ723198&amp;z=126">SJ723198</a></td></tr><tr style="background-color: #FFF"><td>Tue 21/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76402&amp;bpg=">NWO Summer Street O Series</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU111834&amp;z=126">Freshbrook</a></td>
				<td>Swindon</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU111834&amp;z=126">SU111834</a></td></tr><tr style="background-color: #EEE"><td>Tue 21/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26361&amp;bpg=">Track to Terrain Coaching Session 4</a></td>
				<td>Activity</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BS8 3PZ&amp;z=126">Leigh Woods</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BS8 3PZ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 21/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26899&amp;bpg=">PFO Towneley Park Series 4 of 4</a></td>
				<td>Activity</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB11 3RQ&amp;z=126">Towneley Park by Rotunda Cafe</a></td>
				<td>Burnley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB11 3RQ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75208&amp;bpg=">STAG Spring 5  WOW 3!!!</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS609579&amp;z=126">Cathkin Braes Country Park</a></td>
				<td>Glasgow</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS609579&amp;z=126">NS609579</a></td></tr><tr style="background-color: #FFF"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75475&amp;bpg=">World Orienteering Day Event - John Port School</a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK267319&amp;z=126">John Port School - Etwall</a></td>
				<td>Derby</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK267319&amp;z=126">SK267319</a></td></tr><tr style="background-color: #EEE"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75486&amp;bpg=">WEE 3</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75501&amp;bpg=">OD Summer Evening Event - Hay Wood</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP205708&amp;z=126">Hay Wood</a></td>
				<td>Baddesley Clinton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP205708&amp;z=126">SP205708</a></td></tr><tr style="background-color: #EEE"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75855&amp;bpg=">SBOC - Summer League 3</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Clyne Valley (North)</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75870&amp;bpg=">SBOC - Summer League 4</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Llanmadoc Hill</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75954&amp;bpg=">LEI Summer League 4</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK312161&amp;z=126">Feanedock</a></td>
				<td>Ashby de la Zouch</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK312161&amp;z=126">SK312161</a></td></tr><tr style="background-color: #FFF"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75973&amp;bpg=">FVO WEE Polmaise</a></td>
				<td>Local</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS772923&amp;z=126">Polmaise</a></td>
				<td>Cambusbarron</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS772923&amp;z=126">NS772923</a></td></tr><tr style="background-color: #EEE"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75988&amp;bpg=">BOK Urban Series 5</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Bristol</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76004&amp;bpg=">Poacher 7 - Swallow Vale</a></td>
				<td>Local</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Swallow</td>
				<td>Swallow</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76060&amp;bpg=">Aire Spring Sprint League</a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE272399&amp;z=126">Adel Village</a></td>
				<td>Leeds</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE272399&amp;z=126">SE272399</a></td></tr><tr style="background-color: #FFF"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76076&amp;bpg=">Summer Evening Event Bryn Alyn</a></td>
				<td>Local</td>
				<td><a href="http://www.deeside-orienteering-club.org.uk" target="_blank">DEE</a></td>
				<td>NWOA</td>
				<td>Bryn Alyn</td>
				<td>Mold</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76122&amp;bpg=">RR Sprint Series 5</a></td>
				<td>Local</td>
				<td><a href="http://roxburghreivers.org.uk" target="_blank">RR</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT517141&amp;z=126">Heronhill</a></td>
				<td>Hawick</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT517141&amp;z=126">NT517141</a></td></tr><tr style="background-color: #FFF"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76334&amp;bpg=">GRAMP Summer Series - Hazlehead</a></td>
				<td>Local</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ896094&amp;z=126">Hazlehead</a></td>
				<td>Aberdeen</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ896094&amp;z=126">NJ896094</a></td></tr><tr style="background-color: #EEE"><td>Wed 22/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76387&amp;bpg=">Cardiff Park Series 2</a></td>
				<td>Local</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CF10 3ER&amp;z=126">Bute Park</a></td>
				<td>Cardiff</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CF10 3ER&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Thu 23/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76067&amp;bpg=">Thursday Evening Three 2019</a></td>
				<td>Local</td>
				<td><a href="http://www.nwoc.info" target="_blank">NWOC</a></td>
				<td>NIOA</td>
				<td></td>
				<td>Limavady</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 23/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76116&amp;bpg=">Powys Primary Schools Championships</a></td>
				<td>Local</td>
				<td><a href="http://www.mid-wales-orienteers.org.uk" target="_blank">MWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO085975&amp;z=126">Gregynog Hall Estate</a></td>
				<td>Newtown</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO085975&amp;z=126">SO085975</a></td></tr><tr style="background-color: #FFF"><td>Thu 23/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76175&amp;bpg=">Summer series 4</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Seatoller, Borrowdale</td>
				<td>Keswick</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 23/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76212&amp;bpg=">LOC Primary Schools Series 4</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY390009&amp;z=126">Brockhole Country Park</a></td>
				<td>Windermere</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY390009&amp;z=126">NY390009</a></td></tr><tr style="background-color: #FFF"><td>Thu 23/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76373&amp;bpg=">SEE Baggeridge - HOC SEE League</a></td>
				<td>Local</td>
				<td><a href="http://www.harlequins.org.uk" target="_blank">HOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO897930&amp;z=126">Baggeridge Country Park</a></td>
				<td>Sedgley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO897930&amp;z=126">SO897930</a></td></tr><tr style="background-color: #EEE"><td>Sat 25/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71858&amp;bpg=">Scottish Orienteering Championships - Individual (UKOL)</a></td>
				<td>National</td>
				<td><a href="http://www.solwayorienteers.co.uk" target="_blank">SOLWAY</a></td>
				<td>SOA</td>
				<td>Dalbeattie Forest</td>
				<td>Dalbeattie - Dumfries&amp;Galloway</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 25/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73805&amp;bpg=">Springtime in Shropshire 2019  Day 1 Urban Shrewsbury (UKUL &amp; WMUL 2)</a></td>
				<td>National</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ498124&amp;z=126">Shrewsbury</a></td>
				<td>Shrewsbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ498124&amp;z=126">SJ498124</a></td></tr><tr style="background-color: #EEE"><td>Sat 25/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75833&amp;bpg=">Wessex Region Summer Series and League</a></td>
				<td>Local</td>
				<td><a href="http://southampton-orienteers.org.uk" target="_blank">SOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU459092&amp;z=126">Westwood</a></td>
				<td>Southampton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU459092&amp;z=126">SU459092</a></td></tr><tr style="background-color: #FFF"><td>Sat 25/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75944&amp;bpg=">Whitworth Park</a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK275628&amp;z=126">Whitworth Park</a></td>
				<td>Darley Dale</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK275628&amp;z=126">SK275628</a></td></tr><tr style="background-color: #EEE"><td>Sun 26/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71313&amp;bpg=">Midlands Championships (UKOL)/Springtime in Shropshire 2019 Day 2</a></td>
				<td>Major</td>
				<td><a href="http://www.harlequins.org.uk" target="_blank">HOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO610852&amp;z=126">Brown Clee</a></td>
				<td>Bridgnorth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO610852&amp;z=126">SO610852</a></td></tr><tr style="background-color: #FFF"><td>Sun 26/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71859&amp;bpg=">Scottish Orienteering Championships - Relay</a></td>
				<td>Regional</td>
				<td><a href="http://www.solwayorienteers.co.uk" target="_blank">SOLWAY</a></td>
				<td>SOA</td>
				<td>Drumlanrig</td>
				<td>Thornhill, Dumfries&amp;Galloway</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 26/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73733&amp;bpg=">Ripon City - YHOA Urban League</a></td>
				<td>Regional</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td>Ripon</td>
				<td>Ripon</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Mon 27/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73759&amp;bpg=">York City Race</a></td>
				<td>Regional</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td>York</td>
				<td>York</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Mon 27/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73806&amp;bpg=">Springtime in Shropshire 2019  Day 3 Middle (UKOL)</a></td>
				<td>National</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ629081&amp;z=126">The Wrekin</a></td>
				<td>Telford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ629081&amp;z=126">SJ629081</a></td></tr><tr style="background-color: #FFF"><td>Tue 28/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76123&amp;bpg=">RR Sprint Series 6</a></td>
				<td>Local</td>
				<td><a href="http://roxburghreivers.org.uk" target="_blank">RR</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT544341&amp;z=126">Melrose Town</a></td>
				<td>Melrose</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT544341&amp;z=126">NT544341</a></td></tr><tr style="background-color: #EEE"><td>Tue 28/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76289&amp;bpg=">Summer 2019 Street O Series  </a></td>
				<td>Local</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=AL6 9AS&amp;z=126">Welwyn Playing Fields, Ottway Walk, Welwyn Village, AL6 9AS</a></td>
				<td>Welwyn Village</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=AL6 9AS&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 29/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75083&amp;bpg=">Spring - O 4</a></td>
				<td>Local</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td></td>
				<td></td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 29/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75210&amp;bpg=">STAG Spring 6 &amp; FVO WEE </a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS749760&amp;z=126">Cumbernauld Community Park</a></td>
				<td>Glasgow</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS749760&amp;z=126">NS749760</a></td></tr><tr style="background-color: #FFF"><td>Wed 29/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75487&amp;bpg=">WEE 4</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 29/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75510&amp;bpg=">OD Summer Evening Event - Coombe Abbey</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP404790&amp;z=126">Coombe Abbey Park</a></td>
				<td>Coventry</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP404790&amp;z=126">SP404790</a></td></tr><tr style="background-color: #FFF"><td>Wed 29/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75524&amp;bpg=">ELO SprintELOpe 3</a></td>
				<td>Local</td>
				<td><a href="http://www.elo.org.uk" target="_blank">ELO</a></td>
				<td>SOA</td>
				<td>tba</td>
				<td>tba</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 29/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75989&amp;bpg=">BOK Urban Series 6</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST671761&amp;z=126">Emersons Green &amp; Pomphrey Hill</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST671761&amp;z=126">ST671761</a></td></tr><tr style="background-color: #FFF"><td>Wed 29/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76005&amp;bpg=">Poacher 8 - Normanby Park South</a></td>
				<td>Local</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Normanby Hall South</td>
				<td>Scunthorpe</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 29/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76061&amp;bpg=">Aire Spring Sprint League </a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE309377&amp;z=126">Gledhow Valley</a></td>
				<td>Leeds</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE309377&amp;z=126">SE309377</a></td></tr><tr style="background-color: #FFF"><td>Wed 29/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76254&amp;bpg=">Culloden Woods</a></td>
				<td>Local</td>
				<td><a href="http://www.invoc.org.uk" target="_blank">INVOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV2 7JZ&amp;z=126">Culloden Woods</a></td>
				<td>Culloden</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV2 7JZ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 29/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76335&amp;bpg=">GRAMP Summer Series - Countesswells</a></td>
				<td>Local</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ870045&amp;z=126">Countesswells Woods</a></td>
				<td>Aberdeen</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ870045&amp;z=126">NJ870045</a></td></tr><tr style="background-color: #FFF"><td>Wed 29/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26901&amp;bpg=">QUAD training</a></td>
				<td>Activity</td>
				<td><a href="http://www.chig.org.uk" target="_blank">CHIG</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CM16 9UU&amp;z=126">Epping Forest North West.</a></td>
				<td>Loughton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CM16 9UU&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Thu 30/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76068&amp;bpg=">Thursday Evening Four 2019</a></td>
				<td>Local</td>
				<td><a href="http://www.nwoc.info" target="_blank">NWOC</a></td>
				<td>NIOA</td>
				<td></td>
				<td>Limavady</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Thu 30/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76176&amp;bpg=">Summer series 5</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Great Mell Fell</td>
				<td>Penrith</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Fri 31/05/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75856&amp;bpg=">SBOC - Summer League 5</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Port Eynon</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 01/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74762&amp;bpg=">HH Saturday League</a></td>
				<td>Local</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td>Nomansland Common</td>
				<td>St Albans</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 01/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74961&amp;bpg=">NGOC League 6</a></td>
				<td>Local</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO880040&amp;z=126">Toadsmoor Valley</a></td>
				<td>Stroud</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO880040&amp;z=126">SO880040</a></td></tr><tr style="background-color: #FFF"><td>Sat 01/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75266&amp;bpg=">park series 1</a></td>
				<td>Local</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ910418&amp;z=126">longton and florence parks tbc</a></td>
				<td>Longton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ910418&amp;z=126">SJ910418</a></td></tr><tr style="background-color: #EEE"><td>Sat 01/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75437&amp;bpg=">NI Sprint &amp; Middle Distance</a></td>
				<td>Regional</td>
				<td><a href="http://www.nwoc.info" target="_blank">NWOC</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT52 1SA&amp;z=126">Ulster University, Coleraine Campus</a></td>
				<td>Coleriane</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT52 1SA&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 01/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75754&amp;bpg=">DFOK NW Kent 4</a></td>
				<td>Local</td>
				<td><a href="http://www.dfok.co.uk" target="_blank">DFOK</a></td>
				<td>SEOA</td>
				<td>Joydens Wood</td>
				<td>Bexley</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 01/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75798&amp;bpg=">SO Park O 1</a></td>
				<td>Local</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>Lancing College</td>
				<td>Lancing</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 01/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75871&amp;bpg=">SBOC 2x2 Relays</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Oxwich Burrows</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 01/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75948&amp;bpg=">Alvaston Park</a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK378344&amp;z=126">Alvaston Park</a></td>
				<td>Derby</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK378344&amp;z=126">SK378344</a></td></tr><tr style="background-color: #FFF"><td>Sat 01/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76048&amp;bpg=">INT Local Events in Edinburgh and The Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.interlopers.org.uk/" target="_blank">INT</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT091682&amp;z=126">Almondell</a></td>
				<td>Livingston</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT091682&amp;z=126">NT091682</a></td></tr><tr style="background-color: #EEE"><td>Sat 01/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76127&amp;bpg=">Summer Series 2</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td>Cornwall College Campus</td>
				<td>St Austell</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 01/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76221&amp;bpg=">Wessex Summer series Score event (draft)</a></td>
				<td>Local</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td>Tinneys Firs</td>
				<td>Downton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 01/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76397&amp;bpg=">Explore the Parks</a></td>
				<td>Local</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>Wollaton</td>
				<td>Nottingham</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 02/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73734&amp;bpg=">YHOA Urban League</a></td>
				<td>Regional</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK410949&amp;z=126">Rotherham (Wingfield)</a></td>
				<td>Sheffield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK410949&amp;z=126">SK410949</a></td></tr><tr style="background-color: #EEE"><td>Sun 02/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74189&amp;bpg=">SE Sprint Champs</a></td>
				<td>Regional</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td>Horton</td>
				<td>Epsom</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 02/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74668&amp;bpg=">NOR summer series 1</a></td>
				<td>Local</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Norwich</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 02/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74821&amp;bpg=">SWOA South-West Sprint Championships</a></td>
				<td>Regional</td>
				<td><a href="http://www.devonorienteering.co.uk" target="_blank">DEVON</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=EX4 4PU&amp;z=126">Exeter University</a></td>
				<td>Exeter</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=EX4 4PU&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 02/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75139&amp;bpg=">Keyne-O, Furzton</a></td>
				<td>Local</td>
				<td><a href="http://www.smoc.info" target="_blank">SMOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=MK4 1BZ&amp;z=126">Furzton </a></td>
				<td>Milton Keynes</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=MK4 1BZ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 02/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75572&amp;bpg=">ESOC bto SOUL6</a></td>
				<td>Regional</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS135778&amp;z=126">South Queensferry</a></td>
				<td>Edinburgh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS135778&amp;z=126">NS135778</a></td></tr><tr style="background-color: #FFF"><td>Sun 02/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75681&amp;bpg=">2019 Welsh League Race (as part of Midsummer on Gower weekend)</a></td>
				<td>Regional</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SS802809&amp;z=126">Kenfig Burrows</a></td>
				<td>Port Talbot</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SS802809&amp;z=126">SS802809</a></td></tr><tr style="background-color: #EEE"><td>Sun 02/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75821&amp;bpg=">Culbin - Regional and Moray &amp; Highland Junior Champs</a></td>
				<td>Regional</td>
				<td><a href="http://www.moravianorienteering.org" target="_blank">MOR</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NH997615&amp;z=126">Culbin</a></td>
				<td>Forres</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NH997615&amp;z=126">NH997615</a></td></tr><tr style="background-color: #FFF"><td>Sun 02/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75955&amp;bpg=">LEI Summer League 5</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP447953&amp;z=126">Burbage Common</a></td>
				<td>Hinckley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP447953&amp;z=126">SP447953</a></td></tr><tr style="background-color: #EEE"><td>Mon 03/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75593&amp;bpg=">WIM/WSX Monthly Evening event Wareham</a></td>
				<td>Local</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH20 4PG&amp;z=126">Wareham, Dorset</a></td>
				<td>Wareham, Dorset</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH20 4PG&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 04/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75043&amp;bpg=">SROC summer sprint 3</a></td>
				<td>Local</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PR4 1RF&amp;z=126">Astley Park</a></td>
				<td>Chorley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PR4 1RF&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 04/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76196&amp;bpg=">MDOC Summer Evening Sprint Event</a></td>
				<td>Local</td>
				<td><a href="http://www.mdoc.org.uk" target="_blank">MDOC</a></td>
				<td>NWOA</td>
				<td>Torkington Park</td>
				<td>Hazel Grove</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Tue 04/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76213&amp;bpg=">London Park Race Series - Race 2</a></td>
				<td>Local</td>
				<td><a href="http://slow.org.uk/" target="_blank">SLOW</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ268794&amp;z=126">Imperial College</a></td>
				<td>London</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ268794&amp;z=126">TQ268794</a></td></tr><tr style="background-color: #EEE"><td>Tue 04/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76290&amp;bpg=">Summer 2019 Street O Series </a></td>
				<td>Local</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=AL8 6BX&amp;z=126">Campus West car park, Welwyn Garden City, AL8 6BX</a></td>
				<td>Welwyn Garden City</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=AL8 6BX&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 04/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76352&amp;bpg=">BOK Army Championships</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO631089&amp;z=126">Moseley Green West &amp; Cannop Ponds South</a></td>
				<td>Parkend</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO631089&amp;z=126">SO631089</a></td></tr><tr style="background-color: #EEE"><td>Tue 04/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76356&amp;bpg=">Wrekin Summer Series 4</a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO715933&amp;z=126">Bridgnorth Town Centre</a></td>
				<td>Bridgnorth </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO715933&amp;z=126">SO715933</a></td></tr><tr style="background-color: #FFF"><td>Wed 05/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75488&amp;bpg=">WEE 5</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 05/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75511&amp;bpg=">OD Summer Evening Event - Rough Close</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP264780&amp;z=126">Rough Close Scout Camp</a></td>
				<td>Coventry</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP264780&amp;z=126">SP264780</a></td></tr><tr style="background-color: #FFF"><td>Wed 05/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75736&amp;bpg=">PFO Evening series 1 of 4</a></td>
				<td>Local</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB4 7SJ&amp;z=126">Marl Pits</a></td>
				<td>Rawtenstall</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB4 7SJ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 05/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75743&amp;bpg=">ESOC Sprintelope</a></td>
				<td>Local</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td></td>
				<td>Edinburgh</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 05/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75974&amp;bpg=">FVO WEE Beecraigs East</a></td>
				<td>Local</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS998741&amp;z=126">Beecraigs East</a></td>
				<td>Linlithgow</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS998741&amp;z=126">NS998741</a></td></tr><tr style="background-color: #EEE"><td>Wed 05/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75990&amp;bpg=">BOK Urban Series 7</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST622820&amp;z=126">Bradley Stoke</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST622820&amp;z=126">ST622820</a></td></tr><tr style="background-color: #FFF"><td>Wed 05/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76006&amp;bpg=">Poacher 9 - Hemswell</a></td>
				<td>Local</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Hemswell</td>
				<td>Hemswell</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 05/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76234&amp;bpg=">LOC Middle Series 1</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD297882&amp;z=126">Bell Wood</a></td>
				<td>Ulverston</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD297882&amp;z=126">SD297882</a></td></tr><tr style="background-color: #FFF"><td>Wed 05/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76336&amp;bpg=">GRAMP Summer Series - Foggieton</a></td>
				<td>Local</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ882032&amp;z=126">Foggieton</a></td>
				<td>Aberdeen</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ882032&amp;z=126">NJ882032</a></td></tr><tr style="background-color: #EEE"><td>Wed 05/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76388&amp;bpg=">Cardiff Park Series 3</a></td>
				<td>Local</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CF23 5PA&amp;z=126">Roath Park</a></td>
				<td>Cardiff</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CF23 5PA&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 05/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26386&amp;bpg=">STAG Postbox O - No.4</a></td>
				<td>Activity</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>TBC</td>
				<td>Glasgow </td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 06/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75956&amp;bpg=">LEI Summer League 6</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK518070&amp;z=126">Martinshaw Woods</a></td>
				<td>Leicester</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK518070&amp;z=126">SK518070</a></td></tr><tr style="background-color: #FFF"><td>Thu 06/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76070&amp;bpg=">Thursday Evening Five 2019</a></td>
				<td>Local</td>
				<td><a href="http://www.nwoc.info" target="_blank">NWOC</a></td>
				<td>NIOA</td>
				<td></td>
				<td>Limavady</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 06/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76177&amp;bpg=">Summer series 6</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Wasdale</td>
				<td>Egremont</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Thu 06/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76377&amp;bpg=">SEE Kinver Edge South - HOC SEE League</a></td>
				<td>Local</td>
				<td><a href="http://www.harlequins.org.uk" target="_blank">HOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO824820&amp;z=126">Kingsford Forest Park</a></td>
				<td>Kingsford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO824820&amp;z=126">SO824820</a></td></tr><tr style="background-color: #EEE"><td>Fri 07/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73683&amp;bpg=">World Cup Round 1 7-11 Jun</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Finland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Fri 07/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75459&amp;bpg=">Scottish Schools Orienteering Festival</a></td>
				<td>Local</td>
				<td><a href="http://www.tintoorienteers.org/" target="_blank">TINTO</a></td>
				<td>SOA</td>
				<td></td>
				<td>Central Scotland</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 08/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72660&amp;bpg=">Coventry Weekend of Orienteering (UKOL) (WMOA Urban League 3)</a></td>
				<td>National</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td>Warwick University</td>
				<td>Coventry</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 08/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75789&amp;bpg=">Poole Out of Town Race</a></td>
				<td>Regional</td>
				<td><a href="http://www.wessex-oc.org" target="_blank">WSX</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SZ024943&amp;z=126">Canford Heath Estate</a></td>
				<td>Poole</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SZ024943&amp;z=126">SZ024943</a></td></tr><tr style="background-color: #EEE"><td>Sat 08/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75797&amp;bpg=">SO Park O 2</a></td>
				<td>Local</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>East Court</td>
				<td>E Grinstead</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 08/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75825&amp;bpg=">SWOC Summer Series 2 (SWOC League 6) </a></td>
				<td>Local</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SN982203&amp;z=126">Storey Arms</a></td>
				<td>Merthyr Tydfil</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SN982203&amp;z=126">SN982203</a></td></tr><tr style="background-color: #EEE"><td>Sat 08/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75947&amp;bpg=">Holmebrook Valley Park</a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK355730&amp;z=126">Holmebrook Valley Park</a></td>
				<td>Chesterfield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK355730&amp;z=126">SK355730</a></td></tr><tr style="background-color: #FFF"><td>Sat 08/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76200&amp;bpg=">Tadcaster Urban Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE487432&amp;z=126">Tadcaster</a></td>
				<td>Tadcaster</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE487432&amp;z=126">SE487432</a></td></tr><tr style="background-color: #EEE"><td>Sat 08/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76260&amp;bpg=">Aire Local Event </a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE174303&amp;z=126">Bowling Park </a></td>
				<td>Bradford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE174303&amp;z=126">SE174303</a></td></tr><tr style="background-color: #FFF"><td>Sat 08/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76312&amp;bpg=">Saturday Series 8</a></td>
				<td>Local</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK353895&amp;z=126">Parkwood Springs</a></td>
				<td>Sheffield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK353895&amp;z=126">SK353895</a></td></tr><tr style="background-color: #EEE"><td>Sun 09/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72661&amp;bpg=">Coventry Weekend of Orienteering (UKOL) (UKUL) (WMOA Urban League 4)</a></td>
				<td>National</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td>City of Coventry</td>
				<td>Coventry</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 09/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73860&amp;bpg=">Simon Peck Summer Series event 1</a></td>
				<td>Local</td>
				<td><a href="http://www.suffoc.co.uk" target="_blank">SUFFOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CB9 8AA&amp;z=126">Haverhill</a></td>
				<td>Haverhill</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CB9 8AA&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 09/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74760&amp;bpg=">SAX Regional</a></td>
				<td>Regional</td>
				<td><a href="http://www.saxons-oc.org" target="_blank">SAX</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TR076606&amp;z=126">Blean</a></td>
				<td>Faversham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TR076606&amp;z=126">TR076606</a></td></tr><tr style="background-color: #FFF"><td>Sun 09/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74919&amp;bpg=">Cumbrian Galoppen - Threlkeld</a></td>
				<td>Regional</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY326245&amp;z=126">Threlkeld Knotts</a></td>
				<td>Keswick</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY326245&amp;z=126">NY326245</a></td></tr><tr style="background-color: #EEE"><td>Sun 09/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75361&amp;bpg=">Priory Park Local event</a></td>
				<td>Local</td>
				<td><a href="http://www.waoc.org.uk" target="_blank">WAOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PE19 1LQ&amp;z=126">Priory Park</a></td>
				<td>St Neots</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PE19 1LQ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 09/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75395&amp;bpg=">NWO Relay</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU262945&amp;z=126">Badbury Hill</a></td>
				<td>Faringdon</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU262945&amp;z=126">SU262945</a></td></tr><tr style="background-color: #EEE"><td>Sun 09/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75594&amp;bpg=">Jamie Stevenson Trophy</a></td>
				<td>Regional</td>
				<td><a href="http://www.basoc.org.uk/" target="_blank">BASOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NH756005&amp;z=126">Gynack</a></td>
				<td>Kingussie</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NH756005&amp;z=126">NH756005</a></td></tr><tr style="background-color: #FFF"><td>Sun 09/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76433&amp;bpg=">Try Orienteering</a></td>
				<td>Local</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=RH4 3DG&amp;z=126">The Nower</a></td>
				<td>Dorking</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=RH4 3DG&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Mon 10/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75957&amp;bpg=">LEI Summer League 7</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK318141&amp;z=126">Donisthorpe Woodland Centre</a></td>
				<td>Ashby de la Zouch</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK318141&amp;z=126">SK318141</a></td></tr><tr style="background-color: #FFF"><td>Mon 10/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26440&amp;bpg=">BL Club Night, Lazonby</a></td>
				<td>Activity</td>
				<td><a href="http://www.bl-orienteering.org.uk/" target="_blank">BL</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CA10 1BL&amp;z=126">Lazonby School</a></td>
				<td>Penrith</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CA10 1BL&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 11/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75918&amp;bpg=">MV Summer Series</a></td>
				<td>Local</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SM3 8AB&amp;z=126">Nonsuch Park</a></td>
				<td>Cheam</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SM3 8AB&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 11/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76217&amp;bpg=">London Park Race Series - Race 3</a></td>
				<td>Local</td>
				<td><a href="http://slow.org.uk/" target="_blank">SLOW</a></td>
				<td>SEOA</td>
				<td>tbc</td>
				<td>London</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Tue 11/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76367&amp;bpg=">Wrekin Summer Series 5</a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO740928&amp;z=126">Stanmore Country Park</a></td>
				<td>Bridgnorth </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO740928&amp;z=126">SO740928</a></td></tr><tr style="background-color: #FFF"><td>Tue 11/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76403&amp;bpg=">NWO Summer Street O Series</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST999728&amp;z=126">Calne</a></td>
				<td>Calne</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST999728&amp;z=126">ST999728</a></td></tr><tr style="background-color: #EEE"><td>Tue 11/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76424&amp;bpg=">Summer 2019 Street O Series</a></td>
				<td>Local</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=AL7 4BP&amp;z=126">King George V Playing Fields, Beehive Lane, WGC AL7 4BP</a></td>
				<td>Welwyn Garden City</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=AL7 4BP&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 12/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75084&amp;bpg=">Spring - O 5</a></td>
				<td>Local</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td></td>
				<td></td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 12/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75489&amp;bpg=">WEE 6</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 12/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75512&amp;bpg=">OD Summer Evening Event - Brueton Park</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP162790&amp;z=126">Brueton Park</a></td>
				<td>Solihull</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP162790&amp;z=126">SP162790</a></td></tr><tr style="background-color: #EEE"><td>Wed 12/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75525&amp;bpg=">ELO SprintELOpe 4</a></td>
				<td>Local</td>
				<td><a href="http://www.elo.org.uk" target="_blank">ELO</a></td>
				<td>SOA</td>
				<td>tba</td>
				<td>tba</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 12/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75737&amp;bpg=">PFO Evening Series 2 of 4</a></td>
				<td>Local</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB12 8UA&amp;z=126">Gawthorpe and Padiham</a></td>
				<td>Padiham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB12 8UA&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 12/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75857&amp;bpg=">SBOC - Summer League 6 </a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Merthyr Mawr (west)</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 12/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75975&amp;bpg=">FVO WEE Tulliallan</a></td>
				<td>Local</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS931884&amp;z=126">Tulliallan</a></td>
				<td>Kincardine</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS931884&amp;z=126">NS931884</a></td></tr><tr style="background-color: #EEE"><td>Wed 12/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76007&amp;bpg=">Poacher 10 - Scunthorpe Central Park</a></td>
				<td>Local</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Scunthorpe</td>
				<td>Scunthorpe</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 12/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76062&amp;bpg=">Aire Summer Sprint League  </a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE290362&amp;z=126">Woodhouse Ridge</a></td>
				<td>Leeds</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE290362&amp;z=126">SE290362</a></td></tr><tr style="background-color: #EEE"><td>Wed 12/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76077&amp;bpg=">Summer Eveing Event Castle Park Frodsham</a></td>
				<td>Local</td>
				<td><a href="http://www.deeside-orienteering-club.org.uk" target="_blank">DEE</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ514775&amp;z=126">Castle Park</a></td>
				<td>Frodsham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ514775&amp;z=126">SJ514775</a></td></tr><tr style="background-color: #FFF"><td>Wed 12/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76235&amp;bpg=">LOC Middle Series 2</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD486916&amp;z=126">Helsington (TBC)</a></td>
				<td>Kendal</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD486916&amp;z=126">SD486916</a></td></tr><tr style="background-color: #EEE"><td>Wed 12/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76258&amp;bpg=">SROC scout and guide championships</a></td>
				<td>Local</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PR3 2NL&amp;z=126">Beacon Fell</a></td>
				<td>Preston</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PR3 2NL&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 12/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76337&amp;bpg=">GRAMP Summer Series - Tollo Hill</a></td>
				<td>Local</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ923022&amp;z=126">Tollo Hill</a></td>
				<td>Aberdeen</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ923022&amp;z=126">NJ923022</a></td></tr><tr style="background-color: #EEE"><td>Thu 13/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76069&amp;bpg=">Thursday Evening Six 2019 </a></td>
				<td>Local</td>
				<td><a href="http://www.nwoc.info" target="_blank">NWOC</a></td>
				<td>NIOA</td>
				<td></td>
				<td>Limavady</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Thu 13/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76178&amp;bpg=">Summer series 7</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Swarth Fell</td>
				<td>Egremont</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71920&amp;bpg=">Jukola Relay 15-16 Jun</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Finland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73501&amp;bpg=">BOK Blast Day 1</a></td>
				<td>National</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST620781&amp;z=126">University of the West of England</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST620781&amp;z=126">ST620781</a></td></tr><tr style="background-color: #EEE"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74897&amp;bpg=">ParkO- Wimpole Estate </a></td>
				<td>Local</td>
				<td><a href="http://www.waoc.org.uk" target="_blank">WAOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SG8 0BW&amp;z=126">Wimpole Estate</a></td>
				<td>Arrington</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SG8 0BW&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74913&amp;bpg=">Brampton Urban Event  </a></td>
				<td>Local</td>
				<td><a href="http://www.bl-orienteering.org.uk/" target="_blank">BL</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY535612&amp;z=126">The Sands, Brampton</a></td>
				<td>Brampton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY535612&amp;z=126">NY535612</a></td></tr><tr style="background-color: #EEE"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74933&amp;bpg=">ESOC Local Events in Edinburgh and the Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT225686&amp;z=126">Covenanters Wood</a></td>
				<td>Edinburgh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT225686&amp;z=126">NT225686</a></td></tr><tr style="background-color: #FFF"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74994&amp;bpg=">Carsington Pastures 50th Anniversary Event - Closed Event - DVO Members only</a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK245548&amp;z=126">Carsington Pastures</a></td>
				<td>Wirksworth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK245548&amp;z=126">SK245548</a></td></tr><tr style="background-color: #EEE"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75153&amp;bpg=">Junior League 6</a></td>
				<td>Local</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td>Conyngham Hall</td>
				<td>Knaresborough</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75267&amp;bpg=">park series 2</a></td>
				<td>Local</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ865514&amp;z=126">tunstall park tbc</a></td>
				<td>Tunstall</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ865514&amp;z=126">SJ865514</a></td></tr><tr style="background-color: #EEE"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75614&amp;bpg=">Gateshead Saltwell Park Sprint</a></td>
				<td>Local</td>
				<td><a href="http://www.newcastleorienteering.org.uk" target="_blank">NATO</a></td>
				<td>NEOA</td>
				<td>Saltwell Park</td>
				<td>Gateshead</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75796&amp;bpg=">SO Park O 3</a></td>
				<td>Local</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>Surrendon Campus</td>
				<td>Brighton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75834&amp;bpg=">Wessex Region Summer Series and League</a></td>
				<td>Local</td>
				<td><a href="http://southampton-orienteers.org.uk" target="_blank">SOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU439115&amp;z=126">Peartree Green</a></td>
				<td>Southampton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU439115&amp;z=126">SU439115</a></td></tr><tr style="background-color: #FFF"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75943&amp;bpg=">SnookerO- Wimpole Estate  </a></td>
				<td>Local</td>
				<td><a href="http://www.waoc.org.uk" target="_blank">WAOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SG8 0BW&amp;z=126">Wimpole Estate</a></td>
				<td>Arrington</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SG8 0BW&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76128&amp;bpg=">Summer series 3</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td>Falmouth</td>
				<td>Falmouth</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76398&amp;bpg=">Explore the Parks</a></td>
				<td>Local</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>Bramcote Hills</td>
				<td>Nottingham</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 15/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76401&amp;bpg=">Kent Junior Orienteering Festival</a></td>
				<td>Local</td>
				<td><a href="http://www.dfok.co.uk" target="_blank">DFOK</a></td>
				<td>SEOA</td>
				<td>Foots Cray Meadows</td>
				<td>tbc</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 16/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73152&amp;bpg=">Newcastle/Gateshead urban</a></td>
				<td>National</td>
				<td><a href="http://www.newcastleorienteering.org.uk" target="_blank">NATO</a></td>
				<td>NEOA</td>
				<td></td>
				<td>Newcastle</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 16/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73502&amp;bpg=">BOK Blast Day 2</a></td>
				<td>National</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST639898&amp;z=126">Thornbury</a></td>
				<td>Thornbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST639898&amp;z=126">ST639898</a></td></tr><tr style="background-color: #FFF"><td>Sun 16/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74108&amp;bpg=">Allestree Urban Event, EMUL 2019</a></td>
				<td>Regional</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK352408&amp;z=126">Allestree</a></td>
				<td>Derby</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK352408&amp;z=126">SK352408</a></td></tr><tr style="background-color: #EEE"><td>Sun 16/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74669&amp;bpg=">NOR summer series 2</a></td>
				<td>Local</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Norwich</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 16/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74822&amp;bpg=">Devon Relays</a></td>
				<td>Local</td>
				<td><a href="http://www.devonorienteering.co.uk" target="_blank">DEVON</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=EX16 7RQ&amp;z=126">Knightshayes NT</a></td>
				<td>Tiverton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=EX16 7RQ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 16/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74832&amp;bpg=">SOS The Naze</a></td>
				<td>Regional</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TM264234&amp;z=126">The Naze</a></td>
				<td>Walton on the Naze</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TM264234&amp;z=126">TM264234</a></td></tr><tr style="background-color: #FFF"><td>Sun 16/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75086&amp;bpg=">Horwich Festival of Racing</a></td>
				<td>Regional</td>
				<td><a href="http://www.seloc.org.uk" target="_blank">SELOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BL1 4QT&amp;z=126">Horwich Town Centre, Queen's Park and Bolton School</a></td>
				<td>Bolton / Horwich</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BL1 4QT&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 16/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76025&amp;bpg=">OCOUL 3</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT61 9DJ&amp;z=126">Co Armagh - TBC</a></td>
				<td>Armagh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT61 9DJ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 16/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76255&amp;bpg=">Keppernach &amp; Achagour</a></td>
				<td>Regional</td>
				<td><a href="http://www.invoc.org.uk" target="_blank">INVOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV12 5JD&amp;z=126">Keppernach &amp; Achagour</a></td>
				<td>Nairn</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV12 5JD&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Mon 17/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26844&amp;bpg=">Junior Training  </a></td>
				<td>Activity</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP1 3SD&amp;z=126">Old Sarum</a></td>
				<td>Salisbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP1 3SD&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 18/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75044&amp;bpg=">SROC summer sprint 4</a></td>
				<td>Local</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PR25 1DJ&amp;z=126">Worden Park</a></td>
				<td>Leyland</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PR25 1DJ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 18/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76228&amp;bpg=">LOK London Park Race</a></td>
				<td>Local</td>
				<td><a href="http://www.londonorienteering.co.uk" target="_blank">LOK</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ282860&amp;z=126">Hampstead Heath Southeast</a></td>
				<td>Turfnel Park</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ282860&amp;z=126">TQ282860</a></td></tr><tr style="background-color: #FFF"><td>Tue 18/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76368&amp;bpg=">Wrekin Summer Series 6</a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO753839&amp;z=126">Severn Valley Country Park</a></td>
				<td>Bridgnorth </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO753839&amp;z=126">SO753839</a></td></tr><tr style="background-color: #EEE"><td>Tue 18/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76378&amp;bpg=">SEE Lickey - HOC SEE League</a></td>
				<td>Local</td>
				<td><a href="http://www.harlequins.org.uk" target="_blank">HOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO997753&amp;z=126">Lickey Hills Country Park</a></td>
				<td>Lickey</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO997753&amp;z=126">SO997753</a></td></tr><tr style="background-color: #FFF"><td>Tue 18/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76425&amp;bpg=">Summer 2019 Street O Series</a></td>
				<td>Local</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=AL10 8TZ&amp;z=126">Hatfield (North) Link Drive Car Park, Hatfield AL10 8TZ</a></td>
				<td>Hatfield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=AL10 8TZ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 19/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75490&amp;bpg=">WEE 7</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 19/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75514&amp;bpg=">OD Summer Evening Event - Hartshill Hayes</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP317942&amp;z=126">Hartshill Hayes Country Park</a></td>
				<td>Nuneaton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP317942&amp;z=126">SP317942</a></td></tr><tr style="background-color: #EEE"><td>Wed 19/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75738&amp;bpg=">PFO Evening Series 3 of 4</a></td>
				<td>Local</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB8 9SG&amp;z=126">Alkincoats Park</a></td>
				<td>Nelson</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB8 9SG&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 19/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75744&amp;bpg=">ESOC Sprintelope</a></td>
				<td>Local</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td></td>
				<td>Edinburgh</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 19/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75858&amp;bpg=">SBOC - Summer League 7</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Penmaen &amp; Nicholaston Burrows</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 19/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75958&amp;bpg=">LEI Summer League 8</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK514159&amp;z=126">Outwoods</a></td>
				<td>Loughborough</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK514159&amp;z=126">SK514159</a></td></tr><tr style="background-color: #EEE"><td>Wed 19/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75976&amp;bpg=">FVO WEE Duncraggan</a></td>
				<td>Local</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN546065&amp;z=126">Duncraggan</a></td>
				<td>Brig O Turk</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN546065&amp;z=126">NN546065</a></td></tr><tr style="background-color: #FFF"><td>Wed 19/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76008&amp;bpg=">Poacher 11 - Cleethorprs CP</a></td>
				<td>Local</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Cleethorpes</td>
				<td>Cleethorpes</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 19/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76203&amp;bpg=">Aire Summer Sprint League   </a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE169344&amp;z=126">Peel Park</a></td>
				<td>Bradford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE169344&amp;z=126">SE169344</a></td></tr><tr style="background-color: #FFF"><td>Wed 19/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76236&amp;bpg=">LOC Middle Series 3</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD377975&amp;z=126">Claife South</a></td>
				<td>Near Sawry</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD377975&amp;z=126">SD377975</a></td></tr><tr style="background-color: #EEE"><td>Wed 19/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76338&amp;bpg=">GRAMP Summer Series - Balmedie</a></td>
				<td>Local</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ975181&amp;z=126">Balmedie</a></td>
				<td>Aberdeen</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ975181&amp;z=126">NJ975181</a></td></tr><tr style="background-color: #FFF"><td>Wed 19/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76390&amp;bpg=">Cardiff Park Series 4</a></td>
				<td>Local</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CF11 9HZ&amp;z=126">Llandaff Fields</a></td>
				<td>Cardiff</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CF11 9HZ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 19/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26387&amp;bpg=">STAG Postbox O - No.5</a></td>
				<td>Activity</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>TBC</td>
				<td>Glasgow </td>
				<td></td></tr><tr style="background-color: #FFF"><td>Thu 20/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76179&amp;bpg=">Summer series 8</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Holme Wood</td>
				<td>Cockermouth</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 20/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76197&amp;bpg=">MDOC Summer Evening Event</a></td>
				<td>Local</td>
				<td><a href="http://www.mdoc.org.uk" target="_blank">MDOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ795654&amp;z=126">Brereton Heath</a></td>
				<td>Holmes Chapel</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ795654&amp;z=126">SJ795654</a></td></tr><tr style="background-color: #FFF"><td>Thu 20/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=25894&amp;bpg=">Sprint Scotland Training Day</a></td>
				<td>Activity</td>
				<td><a href="http://www.masterplanadventure.uk" target="_blank">Masterplan Adventure</a></td>
				<td>SOA</td>
				<td>tbc</td>
				<td>tbc</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 20/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26890&amp;bpg=">June Jaunter</a></td>
				<td>Activity</td>
				<td><a href="http://www.harlequins.org.uk" target="_blank">HOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=B62 0NQ&amp;z=126">Clent Hills</a></td>
				<td>Romsley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=B62 0NQ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Fri 21/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75483&amp;bpg=">Tollymore Weekend Urban Race</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT34 1BE&amp;z=126">Newry City Centre</a></td>
				<td>Newry</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT34 1BE&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Fri 21/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=25895&amp;bpg=">Sprint Scotland Training Day</a></td>
				<td>Activity</td>
				<td><a href="http://www.masterplanadventure.uk" target="_blank">Masterplan Adventure</a></td>
				<td>SOA</td>
				<td>tbc</td>
				<td>tbc</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 22/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73735&amp;bpg=">YHOA Urban League Middle Distance (p.m)</a></td>
				<td>Regional</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Gainsborough Town</td>
				<td>Gainsborough Town</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 22/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73736&amp;bpg=">YHOA Sprint Championships (a.m.) and YHOA Urban League</a></td>
				<td>Regional</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Gainsborough Park Springs</td>
				<td>Gainsborough</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 22/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74807&amp;bpg=">WIM SEOUL Urban Event - Ringwood</a></td>
				<td>Regional</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH24 1DW&amp;z=126">Ringwood</a></td>
				<td>Ringwood</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH24 1DW&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 22/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75000&amp;bpg=">Beginners, Families and Schools Events</a></td>
				<td>Local</td>
				<td><a href="http://www.coboc.org.uk" target="_blank">COBOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP130922&amp;z=126">Pype Hayes Park</a></td>
				<td>Sutton Coldfield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP130922&amp;z=126">SP130922</a></td></tr><tr style="background-color: #FFF"><td>Sat 22/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75046&amp;bpg=">Sprint Scotland Weekend Race 1 - bto SOUL7 and UKUL</a></td>
				<td>Regional</td>
				<td><a href="http://www.masterplanadventure.uk" target="_blank">Masterplan Adventure</a></td>
				<td>SOA</td>
				<td>Bo'ness</td>
				<td>Bo'ness</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 22/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75438&amp;bpg=">NI Colour Series 3</a></td>
				<td>Regional</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT25 2EF&amp;z=126">Slieve Croob</a></td>
				<td>Dromara</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT25 2EF&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 22/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75479&amp;bpg=">Sprint Scotland Weekend Race 2 - bto SOUL7 and UKUL</a></td>
				<td>Regional</td>
				<td><a href="http://www.masterplanadventure.uk" target="_blank">Masterplan Adventure</a></td>
				<td>SOA</td>
				<td>Bo'ness</td>
				<td>Bo'ness</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 22/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75946&amp;bpg=">Hall Leys Park</a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK297600&amp;z=126">Hall Leys Park</a></td>
				<td>Matlock</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK297600&amp;z=126">SK297600</a></td></tr><tr style="background-color: #FFF"><td>Sat 22/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76261&amp;bpg=">Aire Local Event  (copy)</a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE232380&amp;z=126">Horsforth Hall Park </a></td>
				<td>Leeds</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE232380&amp;z=126">SE232380</a></td></tr><tr style="background-color: #EEE"><td>Sun 23/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73861&amp;bpg=">Simon Peck Summer Series event 2</a></td>
				<td>Local</td>
				<td><a href="http://www.suffoc.co.uk" target="_blank">SUFFOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NR32 4PQ&amp;z=126">Gunton Denes</a></td>
				<td>Lowestoft</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NR32 4PQ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 23/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74537&amp;bpg=">2019 Welsh League Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.mid-wales-orienteers.org.uk" target="_blank">MWOC</a></td>
				<td>WOA</td>
				<td>Teifi Pools</td>
				<td>Tregaron</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 23/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74794&amp;bpg=">East Midlands Sprint Championships 2019 and East Midlands Urban League 2019</a></td>
				<td>Regional</td>
				<td><a href="http://www.logonline.org.uk" target="_blank">LOG</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK893622&amp;z=126">Witham St Hughs</a></td>
				<td>Newark</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK893622&amp;z=126">SK893622</a></td></tr><tr style="background-color: #FFF"><td>Sun 23/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74993&amp;bpg=">CHIG GLOSS event</a></td>
				<td>Local</td>
				<td><a href="http://www.chig.org.uk" target="_blank">CHIG</a></td>
				<td>SEOA</td>
				<td>Gunpowder Park</td>
				<td>tbc</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 23/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75047&amp;bpg=">Sprint Scotland Weekend - Race 3</a></td>
				<td>Regional</td>
				<td><a href="http://www.masterplanadventure.uk" target="_blank">Masterplan Adventure</a></td>
				<td>SOA</td>
				<td>Bo'ness</td>
				<td>Bo'ness</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 23/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75124&amp;bpg=">Chairman's SW Summer Relay</a></td>
				<td>Local</td>
				<td><a href="http://www.quantockorienteers.co.uk" target="_blank">QO</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Taunton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 23/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26228&amp;bpg=">Tollymore Weekend Sunday Score</a></td>
				<td>Activity</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT33 0PR&amp;z=126">Tollymore</a></td>
				<td>Newcastle</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT33 0PR&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 25/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75919&amp;bpg=">MV Summer Series</a></td>
				<td>Local</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SM3 8AB&amp;z=126">Nonsuch Park</a></td>
				<td>Cheam</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SM3 8AB&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 25/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76078&amp;bpg=">Summer Evening Event Arrowe Park</a></td>
				<td>Local</td>
				<td><a href="http://www.deeside-orienteering-club.org.uk" target="_blank">DEE</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ275857&amp;z=126">Arrowe Park</a></td>
				<td>Birkenhead</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ275857&amp;z=126">SJ275857</a></td></tr><tr style="background-color: #FFF"><td>Tue 25/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76229&amp;bpg=">LOK London Park Race</a></td>
				<td>Local</td>
				<td><a href="http://www.londonorienteering.co.uk" target="_blank">LOK</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ325902&amp;z=126">Lordship Lane RG &amp; Downhills Park</a></td>
				<td>Turnpike Lane</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ325902&amp;z=126">TQ325902</a></td></tr><tr style="background-color: #EEE"><td>Tue 25/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76369&amp;bpg=">Wrekin Summer Series 7</a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ490128&amp;z=126">Shrewsbury Urban </a></td>
				<td>Shrewsbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ490128&amp;z=126">SJ490128</a></td></tr><tr style="background-color: #FFF"><td>Tue 25/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76426&amp;bpg=">Summer 2019 Street O Series</a></td>
				<td>Local</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=AL10 8TZ&amp;z=126">Hatfield (South) Link Drive Car Park, Hatfield AL10 8TZ</a></td>
				<td>Hatfield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=AL10 8TZ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 26/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75085&amp;bpg=">Spring - O 6</a></td>
				<td>Local</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>Harrogate</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 26/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75311&amp;bpg=">Sutton Park Round the Gates Run &amp; Colour Coded Event</a></td>
				<td>Local</td>
				<td><a href="http://www.coboc.org.uk" target="_blank">COBOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP116964&amp;z=126">Sutton Park - Town Gate</a></td>
				<td>Sutton Coldfield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP116964&amp;z=126">SP116964</a></td></tr><tr style="background-color: #EEE"><td>Wed 26/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75491&amp;bpg=">WEE 8</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 26/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75739&amp;bpg=">PFO Evening Series 4 of 4</a></td>
				<td>Local</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB11 5QL&amp;z=126">Hameldon Woods</a></td>
				<td>Accrington</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB11 5QL&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 26/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75859&amp;bpg=">SBOC - Summer League 8</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Merthyr Mawr (east)</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 26/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75977&amp;bpg=">FVO WEE Beecraigs West</a></td>
				<td>Local</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS998741&amp;z=126">Beecraigs West</a></td>
				<td>Linlithgow</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS998741&amp;z=126">NS998741</a></td></tr><tr style="background-color: #EEE"><td>Wed 26/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75991&amp;bpg=">BOK Urban Series 8</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST626696&amp;z=126">Stockwood</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST626696&amp;z=126">ST626696</a></td></tr><tr style="background-color: #FFF"><td>Wed 26/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76204&amp;bpg=">Aire Summer Sprint League    </a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE275303&amp;z=126">Cottingley</a></td>
				<td>Leeds</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE275303&amp;z=126">SE275303</a></td></tr><tr style="background-color: #EEE"><td>Wed 26/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76237&amp;bpg=">LOC Middle Series 4</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY449039&amp;z=126">Kentmere Crag Quarter (TBC)</a></td>
				<td>Staveley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY449039&amp;z=126">NY449039</a></td></tr><tr style="background-color: #FFF"><td>Wed 26/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76339&amp;bpg=">GRAMP Summer Series - Crathes</a></td>
				<td>Local</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO735968&amp;z=126">Crathes castle</a></td>
				<td>Banchory</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO735968&amp;z=126">NO735968</a></td></tr><tr style="background-color: #EEE"><td>Thu 27/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75959&amp;bpg=">LEI Summer League 9</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td>Leicester Castle and the Newarke</td>
				<td>Leicester</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Thu 27/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76180&amp;bpg=">Summer series 9</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Latterbarrow</td>
				<td>Egremont</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Fri 28/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72345&amp;bpg=">European Youth Orienteering Championships 28-30 Jun</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Belarus</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Fri 28/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76374&amp;bpg=">JOK Chasing Sprint</a></td>
				<td>Regional</td>
				<td><a href="http://www.masterplanadventure.uk" target="_blank">Masterplan Adventure</a></td>
				<td>SOA</td>
				<td></td>
				<td>Falkirk</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 29/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74152&amp;bpg=">Adams-Avery &amp; BOK Junior Relays </a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST558787&amp;z=126">Blaise Castle Estate</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST558787&amp;z=126">ST558787</a></td></tr><tr style="background-color: #FFF"><td>Sat 29/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75224&amp;bpg=">ELO Local Events in Edinburgh and the Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.elo.org.uk" target="_blank">ELO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT710773&amp;z=126">Barns Ness</a></td>
				<td>Dunbar</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT710773&amp;z=126">NT710773</a></td></tr><tr style="background-color: #EEE"><td>Sat 29/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75268&amp;bpg=">park series 3</a></td>
				<td>Local</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ886487&amp;z=126">central forest park --tbc</a></td>
				<td>Hanley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ886487&amp;z=126">SJ886487</a></td></tr><tr style="background-color: #FFF"><td>Sat 29/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75554&amp;bpg=">DFOK KOL 10</a></td>
				<td>Local</td>
				<td><a href="http://www.dfok.co.uk" target="_blank">DFOK</a></td>
				<td>SEOA</td>
				<td>Jeskyns Community Woodland</td>
				<td>Gravesend</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 29/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75795&amp;bpg=">SO Park O 4</a></td>
				<td>Local</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>Hove Park</td>
				<td>Hove</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 29/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75945&amp;bpg=">Darley Park</a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK353384&amp;z=126">Darley Park</a></td>
				<td>Derby</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK353384&amp;z=126">SK353384</a></td></tr><tr style="background-color: #EEE"><td>Sat 29/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76129&amp;bpg=">Summer Series 4</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td>Liskeard</td>
				<td>Liskeard</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 29/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76349&amp;bpg=">Summer Series Event</a></td>
				<td>Local</td>
				<td><a href="http://www.wessex-oc.org" target="_blank">WSX</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SZ124940&amp;z=126">Littledown Leisure Centre</a></td>
				<td>Bournemouth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SZ124940&amp;z=126">SZ124940</a></td></tr><tr style="background-color: #EEE"><td>Sat 29/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76399&amp;bpg=">Explore the Parks</a></td>
				<td>Local</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>Rushcliffe Country Park</td>
				<td>Nottingham</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 30/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73737&amp;bpg=">EBOR Club Championships</a></td>
				<td>Regional</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td>Hollicarrs Wood</td>
				<td>Selby</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 30/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74670&amp;bpg=">NOR summer series 3</a></td>
				<td>Local</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TG079398&amp;z=126">Holt Hall</a></td>
				<td>Holt</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TG079398&amp;z=126">TG079398</a></td></tr><tr style="background-color: #FFF"><td>Sun 30/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75414&amp;bpg=">Devon Club Championships</a></td>
				<td>Local</td>
				<td><a href="http://www.devonorienteering.co.uk" target="_blank">DEVON</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=EX5 3LE&amp;z=126">Killerton NT</a></td>
				<td>Exeter</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=EX5 3LE&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 30/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75558&amp;bpg=">SLOW GLOSS Event</a></td>
				<td>Local</td>
				<td><a href="http://slow.org.uk/" target="_blank">SLOW</a></td>
				<td>SEOA</td>
				<td>Osterley Park</td>
				<td>tbc</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 30/06/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75694&amp;bpg=">Maroc Regional Event - Potarch</a></td>
				<td>Regional</td>
				<td><a href="http://www.marocscotland.org.uk" target="_blank">MAROC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ab31 4dd&amp;z=126">Potarch</a></td>
				<td>Banchory</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ab31 4dd&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 02/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75045&amp;bpg=">SROC summer sprint 5</a></td>
				<td>Local</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LA1 4YW&amp;z=126">Lancaster University</a></td>
				<td>Lancaster</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LA1 4YW&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 02/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75960&amp;bpg=">LEI Summer League 10</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK521148&amp;z=126">Beacon Hill</a></td>
				<td>Loughborough</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK521148&amp;z=126">SK521148</a></td></tr><tr style="background-color: #EEE"><td>Tue 02/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76371&amp;bpg=">Wrekin Summer Series 8</a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ549102&amp;z=126">Attingham Park (NT) </a></td>
				<td>Shrewsbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ549102&amp;z=126">SJ549102</a></td></tr><tr style="background-color: #FFF"><td>Tue 02/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76427&amp;bpg=">Summer 2019 Street O Series </a></td>
				<td>Local</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=EN6 5AU&amp;z=126">Salisbury Close car park, Potters Bar, EN6 5AU</a></td>
				<td>Potters Bar</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=EN6 5AU&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 02/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76434&amp;bpg=">Park Race</a></td>
				<td>Local</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SM6 7NN&amp;z=126">Beddington Park</a></td>
				<td>Beddington</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SM6 7NN&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 03/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75515&amp;bpg=">OD Summer Evening Event - Coundon Hall Park</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP312829&amp;z=126">Coundon Hall Park</a></td>
				<td>Coventry</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP312829&amp;z=126">SP312829</a></td></tr><tr style="background-color: #EEE"><td>Wed 03/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75745&amp;bpg=">ESOC Sprintelope</a></td>
				<td>Local</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td></td>
				<td>Edinburgh</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 03/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75860&amp;bpg=">SBOC - Summer League 9</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Kilvey Hill (North)</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 03/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75992&amp;bpg=">BOK Urban Series 9</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST707841&amp;z=126">Yate</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST707841&amp;z=126">ST707841</a></td></tr><tr style="background-color: #FFF"><td>Wed 03/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76205&amp;bpg=">Aire Summer Sprint League     </a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE294362&amp;z=126">Miles Hill</a></td>
				<td>Leeds</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE294362&amp;z=126">SE294362</a></td></tr><tr style="background-color: #EEE"><td>Wed 03/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76238&amp;bpg=">LOC Middle Series 5</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD150784&amp;z=126">Haverigg</a></td>
				<td>Millom</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD150784&amp;z=126">SD150784</a></td></tr><tr style="background-color: #FFF"><td>Wed 03/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76240&amp;bpg=">Cumbrian Schools </a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD150784&amp;z=126">Haverigg</a></td>
				<td>Millom</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD150784&amp;z=126">SD150784</a></td></tr><tr style="background-color: #EEE"><td>Wed 03/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76340&amp;bpg=">GRAMP Summer Series - Scolty</a></td>
				<td>Local</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO687948&amp;z=126">Scolty</a></td>
				<td>Banchory</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO687948&amp;z=126">NO687948</a></td></tr><tr style="background-color: #FFF"><td>Wed 03/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76391&amp;bpg=">Cardiff Park Series 5</a></td>
				<td>Local</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td>Llanishen</td>
				<td>Cardiff</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 04/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76181&amp;bpg=">Summer series 10</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Mosser Fell</td>
				<td>Cockermouth</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Thu 04/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76198&amp;bpg=">MDOC Summer Evening Event</a></td>
				<td>Local</td>
				<td><a href="http://www.mdoc.org.uk" target="_blank">MDOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ860772&amp;z=126">Alderley Edge</a></td>
				<td>Alderley Edge</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ860772&amp;z=126">SJ860772</a></td></tr><tr style="background-color: #EEE"><td>Fri 05/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26923&amp;bpg=">Moseley Festival</a></td>
				<td>Activity</td>
				<td><a href="http://www.coboc.org.uk" target="_blank">COBOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=B13 8DD&amp;z=126">Moseley Park</a></td>
				<td>Birmingham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=B13 8DD&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 06/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71916&amp;bpg=">World Masters Orienteering Championships 6-12 Jul</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Latvia</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 06/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73738&amp;bpg=">YHOA Urban league</a></td>
				<td>Regional</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td>Lower Baildon</td>
				<td>Baildon</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 06/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74761&amp;bpg=">HH Saturday League &amp; GLOSS</a></td>
				<td>Local</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td>Highfield Park</td>
				<td>tbc</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 06/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75755&amp;bpg=">DFOK NW Kent 5</a></td>
				<td>Local</td>
				<td><a href="http://www.dfok.co.uk" target="_blank">DFOK</a></td>
				<td>SEOA</td>
				<td>Jubilee Park</td>
				<td>Petts wood</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 06/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75794&amp;bpg=">SO Park O 5</a></td>
				<td>Local</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>Christs Hospital College</td>
				<td>Horsham</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 06/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75949&amp;bpg=">Carsington Stones Island</a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK244514&amp;z=126">Carsington Stones Island</a></td>
				<td>Wirksworth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK244514&amp;z=126">SK244514</a></td></tr><tr style="background-color: #FFF"><td>Sat 06/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75978&amp;bpg=">Wim/WSX Activate event</a></td>
				<td>Local</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH21 6RS&amp;z=126">Potterne Park, Verwood BH21 6RS</a></td>
				<td>Verwood</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH21 6RS&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 06/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76049&amp;bpg=">INT Local Events in Edinburgh and The Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.interlopers.org.uk/" target="_blank">INT</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT033694&amp;z=126">Dechmont Law</a></td>
				<td>Livingston</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT033694&amp;z=126">NT033694</a></td></tr><tr style="background-color: #FFF"><td>Sat 06/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26926&amp;bpg=">Moseley Festival </a></td>
				<td>Activity</td>
				<td><a href="http://www.coboc.org.uk" target="_blank">COBOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=B13 8DD&amp;z=126">Moseley Park</a></td>
				<td>Birmingham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=B13 8DD&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 07/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=68648&amp;bpg=">Yvette Baker Trophy Final</a></td>
				<td>National</td>
				<td></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PE35 6EH&amp;z=126">Sandringham</a></td>
				<td>Kings Lynn</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PE35 6EH&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 07/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71917&amp;bpg=">Junior World Orienteering Championships 7-12 July</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Denmark</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 07/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73922&amp;bpg=">Moonraker (Draft)</a></td>
				<td>Local</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td>Warminster</td>
				<td>Warminster</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 07/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74954&amp;bpg=">Urban event</a></td>
				<td>Regional</td>
				<td><a href="http://www.clok.org.uk" target="_blank">CLOK</a></td>
				<td>NEOA</td>
				<td>Northallerton</td>
				<td>Northallerton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 07/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75724&amp;bpg=">SN Urban event</a></td>
				<td>Regional</td>
				<td><a href="https://www.southernnavigators.com/" target="_blank">SN</a></td>
				<td>SEOA</td>
				<td>Frimley</td>
				<td>Frimley</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 07/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75892&amp;bpg=">GRAMP Balmedie - Regional</a></td>
				<td>Regional</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ975181&amp;z=126">Balmedie</a></td>
				<td>Aberdeen</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ975181&amp;z=126">NJ975181</a></td></tr><tr style="background-color: #EEE"><td>Sun 07/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75950&amp;bpg=">Carsington Stones Island (day 2)</a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK244514&amp;z=126">Carsington Stones Island</a></td>
				<td>Wirksworth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK244514&amp;z=126">SK244514</a></td></tr><tr style="background-color: #FFF"><td>Mon 08/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26443&amp;bpg=">BL Club Night, Shap</a></td>
				<td>Activity</td>
				<td><a href="http://www.bl-orienteering.org.uk/" target="_blank">BL</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CA10 3NL&amp;z=126">Shap School</a></td>
				<td>Penrith</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CA10 3NL&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 09/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75756&amp;bpg=">DFOK Park Race Series</a></td>
				<td>Local</td>
				<td><a href="http://www.dfok.co.uk" target="_blank">DFOK</a></td>
				<td>SEOA</td>
				<td>Lloyd Park</td>
				<td>Croydon</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Tue 09/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75920&amp;bpg=">MV Summer Series</a></td>
				<td>Local</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SM7 1JG&amp;z=126">Nork Park</a></td>
				<td>Cheam</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SM7 1JG&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 09/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76080&amp;bpg=">Summer Evening Event</a></td>
				<td>Local</td>
				<td><a href="http://www.deeside-orienteering-club.org.uk" target="_blank">DEE</a></td>
				<td>NWOA</td>
				<td></td>
				<td>Chester</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Tue 09/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76372&amp;bpg=">Wrekin Summer Series 9</a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ389198&amp;z=126">Nesscliffe Country Park</a></td>
				<td>Shrewsbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ389198&amp;z=126">SJ389198</a></td></tr><tr style="background-color: #EEE"><td>Tue 09/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76420&amp;bpg=">NWO Summer Street O Series</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td>Swindon</td>
				<td>Swindon</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Tue 09/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76428&amp;bpg=">Summer 2019 Street O Series</a></td>
				<td>Local</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=AL2 1EB&amp;z=126">Cotlandswick Leisure Centre, High Street, Lndn Cny AL2 1EB</a></td>
				<td>London Colney</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=AL2 1EB&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 10/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75516&amp;bpg=">OD Summer Evening Event - Ryton Pools</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP370724&amp;z=126">Ryton Pools</a></td>
				<td>Coventry</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP370724&amp;z=126">SP370724</a></td></tr><tr style="background-color: #FFF"><td>Wed 10/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75861&amp;bpg=">SBOC - Summer League 10</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Graig fawr</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 10/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75961&amp;bpg=">LEI Summer League 11</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK411031&amp;z=126">Market Bosworth Country Park</a></td>
				<td>Market Bosworth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK411031&amp;z=126">SK411031</a></td></tr><tr style="background-color: #FFF"><td>Wed 10/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75993&amp;bpg=">BOK Urban Series 10</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST463531&amp;z=126">Cheddar</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST463531&amp;z=126">ST463531</a></td></tr><tr style="background-color: #EEE"><td>Wed 10/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76206&amp;bpg=">Aire Summer Sprint League      </a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE261399&amp;z=126">Holt Park</a></td>
				<td>Leeds</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE261399&amp;z=126">SE261399</a></td></tr><tr style="background-color: #FFF"><td>Wed 10/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76239&amp;bpg=">LOC Middle Series 6</a></td>
				<td>Local</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD402080&amp;z=126">Kirkstone Inn </a></td>
				<td>Troutbeck</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD402080&amp;z=126">SD402080</a></td></tr><tr style="background-color: #EEE"><td>Wed 10/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76341&amp;bpg=">GRAMP Summer Series - Tyrebagger</a></td>
				<td>Local</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ848110&amp;z=126">Tyrebagger woods</a></td>
				<td>Dyce</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ848110&amp;z=126">NJ848110</a></td></tr><tr style="background-color: #FFF"><td>Sat 13/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73672&amp;bpg=">WCH Anniversary WMOA Urban League 5</a></td>
				<td>National</td>
				<td><a href="http://www.walton-chasers.co.uk" target="_blank">WCH</a></td>
				<td>WMOA</td>
				<td>Tamworth Town Centre</td>
				<td>Tamworth</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 13/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74914&amp;bpg=">Eycott Hill - Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.bl-orienteering.org.uk/" target="_blank">BL</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY388305&amp;z=126">Eycott Hill, near Berrier</a></td>
				<td>Keswick</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY388305&amp;z=126">NY388305</a></td></tr><tr style="background-color: #FFF"><td>Sat 13/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75625&amp;bpg=">Staunton Harold Reservoir</a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK377245&amp;z=126">Staunton Harold Reservoir</a></td>
				<td>Ticknall</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK377245&amp;z=126">SK377245</a></td></tr><tr style="background-color: #EEE"><td>Sat 13/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75793&amp;bpg=">SO Park O 6</a></td>
				<td>Local</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>Tilgate Park</td>
				<td>Crawley</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 13/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75826&amp;bpg=">SWOC Summer Series 3 (SWOC League 7)  </a></td>
				<td>Local</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO156170&amp;z=126">Llangynydyr/Llangattock</a></td>
				<td>Crickhowell</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO156170&amp;z=126">SO156170</a></td></tr><tr style="background-color: #EEE"><td>Sat 13/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76130&amp;bpg=">Summer series 5</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td>Holywell Bay</td>
				<td>Newquay</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 13/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26924&amp;bpg=">Sutton Coldfield Community Games</a></td>
				<td>Activity</td>
				<td><a href="http://www.coboc.org.uk" target="_blank">COBOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=B73 6EB&amp;z=126">Wyndley Athletics Track</a></td>
				<td>Sutton Coldfield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=B73 6EB&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 14/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73862&amp;bpg=">Simon Peck Summer Series event 3</a></td>
				<td>Local</td>
				<td><a href="http://www.suffoc.co.uk" target="_blank">SUFFOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IP4 2BX&amp;z=126">Christchurch Park</a></td>
				<td>Ipswich</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IP4 2BX&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 14/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74826&amp;bpg=">WIM Furrow Hopper Relays</a></td>
				<td>Local</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td>Ringwood</td>
				<td>Ringwood - venue TBC</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 14/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74959&amp;bpg=">NGOC League 7</a></td>
				<td>Regional</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO550125&amp;z=126">Knockalls Inclosure (East)</a></td>
				<td>Monmouth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO550125&amp;z=126">SO550125</a></td></tr><tr style="background-color: #FFF"><td>Sun 14/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75560&amp;bpg=">LOK GLOSS event</a></td>
				<td>Local</td>
				<td><a href="http://www.londonorienteering.co.uk" target="_blank">LOK</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ287971&amp;z=126">Trent Park</a></td>
				<td>Cockfosters</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ287971&amp;z=126">TQ287971</a></td></tr><tr style="background-color: #EEE"><td>Sun 14/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26925&amp;bpg=">Sutton Coldfield Community Games</a></td>
				<td>Activity</td>
				<td><a href="http://www.coboc.org.uk" target="_blank">COBOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=B73 6EB&amp;z=126">Wyndley Athletics Track</a></td>
				<td>Sutton Coldfield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=B73 6EB&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Mon 15/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76351&amp;bpg=">Wessex Informal</a></td>
				<td>Local</td>
				<td><a href="http://www.wessex-oc.org" target="_blank">WSX</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SZ112912&amp;z=126">Boscombe Beach and Chine</a></td>
				<td>Bournemouth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SZ112912&amp;z=126">SZ112912</a></td></tr><tr style="background-color: #EEE"><td>Mon 15/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26845&amp;bpg=">Junior Training  </a></td>
				<td>Activity</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP1 3SA&amp;z=126">Hudsons Field</a></td>
				<td>Salisbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP1 3SA&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 16/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76375&amp;bpg=">Wrekin Summer Series 10</a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ562392&amp;z=126">Brown Moss LNR</a></td>
				<td>Whitchurch</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ562392&amp;z=126">SJ562392</a></td></tr><tr style="background-color: #EEE"><td>Wed 17/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75517&amp;bpg=">OD Summer Evening Event - Whinfield Park</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP527746&amp;z=126">Whinfield Park</a></td>
				<td>Rugby</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP527746&amp;z=126">SP527746</a></td></tr><tr style="background-color: #FFF"><td>Wed 17/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76207&amp;bpg=">Aire Summer Sprint League   </a></td>
				<td>Local</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE271382&amp;z=126">Weetwood</a></td>
				<td>Leeds</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE271382&amp;z=126">SE271382</a></td></tr><tr style="background-color: #EEE"><td>Wed 17/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76241&amp;bpg=">ESOC Sprintelope</a></td>
				<td>Local</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td></td>
				<td>Edinburgh</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 17/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76342&amp;bpg=">GRAMP Summer Series - Dunnottar</a></td>
				<td>Local</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO863843&amp;z=126">Dunnottar</a></td>
				<td>Stonehaven</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO863843&amp;z=126">NO863843</a></td></tr><tr style="background-color: #EEE"><td>Wed 17/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76392&amp;bpg=">Cardiff Park Series 6</a></td>
				<td>Local</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CF62 3BY&amp;z=126">Porthkerry Country Park</a></td>
				<td>Barry</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CF62 3BY&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Thu 18/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75962&amp;bpg=">LEI Summer League 12</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK355160&amp;z=126">Ashby Urban</a></td>
				<td>Ashby de la Zouch</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK355160&amp;z=126">SK355160</a></td></tr><tr style="background-color: #EEE"><td>Thu 18/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76079&amp;bpg=">Summer Evening Event - Allerton Towers Park</a></td>
				<td>Local</td>
				<td><a href="http://www.deeside-orienteering-club.org.uk" target="_blank">DEE</a></td>
				<td>NWOA</td>
				<td>Allerton</td>
				<td>Liverpool</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Thu 18/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76183&amp;bpg=">Summer series 11</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Leaps Beck</td>
				<td>Cleator Moor</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 20/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74934&amp;bpg=">ESOC Local Events in Edinburgh and the Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT258706&amp;z=126">Blackford Hill</a></td>
				<td>Edinburgh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT258706&amp;z=126">NT258706</a></td></tr><tr style="background-color: #FFF"><td>Sat 20/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75155&amp;bpg=">YHOA Urban League Sprint</a></td>
				<td>Regional</td>
				<td><a href="http://www.eastpennineoc.org.uk" target="_blank">EPOC</a></td>
				<td>YHOA</td>
				<td>Mytholmroyd</td>
				<td>Mytholmroyd</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 20/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75269&amp;bpg=">park series 4</a></td>
				<td>Local</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ893594&amp;z=126">Biddulph grange country park -tbc</a></td>
				<td>Biddulph</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ893594&amp;z=126">SJ893594</a></td></tr><tr style="background-color: #FFF"><td>Sat 20/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75626&amp;bpg=">Foremark Reservoir</a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK336248&amp;z=126">Foremark Reservoir</a></td>
				<td>Ticknall</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK336248&amp;z=126">SK336248</a></td></tr><tr style="background-color: #EEE"><td>Sat 20/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75835&amp;bpg=">Royal Victoria Country Park Local Event and Barbecue</a></td>
				<td>Local</td>
				<td><a href="http://southampton-orienteers.org.uk" target="_blank">SOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU463079&amp;z=126">Royal Victoria Country Park</a></td>
				<td>Netley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU463079&amp;z=126">SU463079</a></td></tr><tr style="background-color: #FFF"><td>Sun 21/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73739&amp;bpg=">YHOA Urban League  </a></td>
				<td>Regional</td>
				<td><a href="http://www.eastpennineoc.org.uk" target="_blank">EPOC</a></td>
				<td>YHOA</td>
				<td>Hebden Bridge</td>
				<td>Hebden Bridge</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 21/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75140&amp;bpg=">Keyne-O, Willen</a></td>
				<td>Local</td>
				<td><a href="http://www.smoc.info" target="_blank">SMOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=MK15 0BA&amp;z=126">Peace Pagoda Car Park, Willen</a></td>
				<td>Milton Keynes</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=MK15 0BA&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 21/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75556&amp;bpg=">MV GLOSS Event</a></td>
				<td>Local</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td>Nonsuch Park</td>
				<td>tbc</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 21/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75686&amp;bpg=">Wessex Hardy Relay</a></td>
				<td>Local</td>
				<td><a href="http://www.wessex-oc.org" target="_blank">WSX</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SY961913&amp;z=126">Holton Lee</a></td>
				<td>Poole</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SY961913&amp;z=126">SY961913</a></td></tr><tr style="background-color: #FFF"><td>Tue 23/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71919&amp;bpg=">O-Ringen 23-27 Jul</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Sweden</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Tue 23/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75921&amp;bpg=">MV Summer Series</a></td>
				<td>Local</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SM7 1JG&amp;z=126">Nork Park</a></td>
				<td>Cheam</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SM7 1JG&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 23/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75963&amp;bpg=">LEI Summer League 13</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK628021&amp;z=126">Evington Park and Arboretum</a></td>
				<td>Leicester</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK628021&amp;z=126">SK628021</a></td></tr><tr style="background-color: #EEE"><td>Tue 23/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76376&amp;bpg=">Wrekin Summer Series 11</a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ567358&amp;z=126">Twemlows Wood</a></td>
				<td>Whitchurch</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ567358&amp;z=126">SJ567358</a></td></tr><tr style="background-color: #FFF"><td>Wed 24/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75513&amp;bpg=">OD Summer Evening Event - Tudor Grange</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP144794&amp;z=126">Tudor Grange</a></td>
				<td>Solihull</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP144794&amp;z=126">SP144794</a></td></tr><tr style="background-color: #EEE"><td>Wed 24/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76343&amp;bpg=">GRAMP Summer Series - Glen Dye</a></td>
				<td>Local</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO645907&amp;z=126">Glen Dye</a></td>
				<td>Banchory</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO645907&amp;z=126">NO645907</a></td></tr><tr style="background-color: #FFF"><td>Wed 24/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26661&amp;bpg=">Attingham Sunny Summer Wednesdays 1</a></td>
				<td>Activity</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SY4 4TP&amp;z=126">Attingham Park ( NT) </a></td>
				<td>Shrewsbury </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SY4 4TP&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Thu 25/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76184&amp;bpg=">Summer series 12</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Dalegarth</td>
				<td>Eskdale Green</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 27/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75270&amp;bpg=">park series 5</a></td>
				<td>Local</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ870482&amp;z=126">festival park tbc</a></td>
				<td>Hanley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ870482&amp;z=126">SJ870482</a></td></tr><tr style="background-color: #EEE"><td>Sun 28/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73297&amp;bpg=">Scottish Six Days - Strathearn 2019 - Day 1</a></td>
				<td>National</td>
				<td><a href="http://www.marocscotland.org.uk" target="_blank">MAROC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN794197&amp;z=126">Auchingarrich</a></td>
				<td>Comrie</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN794197&amp;z=126">NN794197</a></td></tr><tr style="background-color: #FFF"><td>Mon 29/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73298&amp;bpg=">Scottish Six Days - Strathearn 2019 - Day 2 (UKOL)</a></td>
				<td>National</td>
				<td><a href="http://ecko.org.uk" target="_blank">ECKO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN589237&amp;z=126">Edinchip</a></td>
				<td>Lochearnhead</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN589237&amp;z=126">NN589237</a></td></tr><tr style="background-color: #EEE"><td>Tue 30/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73299&amp;bpg=">Scottish Six Days - Strathearn 2019 - Day 3</a></td>
				<td>National</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN702236&amp;z=126">Dundurn &amp; Cnoc a' Mhadaidh</a></td>
				<td>St.Fillans</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN702236&amp;z=126">NN702236</a></td></tr><tr style="background-color: #FFF"><td>Wed 31/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75344&amp;bpg=">Scottish Six Days - Strathearn 2019 - UKUL Sprint incorporating bto SOUL8</a></td>
				<td>Regional</td>
				<td><a href="http://www.masterplanadventure.uk" target="_blank">Masterplan Adventure</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN858221&amp;z=126">Macrosty Park, Crieff</a></td>
				<td>Crieff</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN858221&amp;z=126">NN858221</a></td></tr><tr style="background-color: #EEE"><td>Wed 31/07/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75964&amp;bpg=">LEI Summer League 14</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK477195&amp;z=126">Memorial Park</a></td>
				<td>Shepshed</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK477195&amp;z=126">SK477195</a></td></tr><tr style="background-color: #FFF"><td>Thu 01/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73300&amp;bpg=">Scottish Six Days - Strathearn 2019 - Day 4</a></td>
				<td>National</td>
				<td><a href="http://www.clydesideorienteers.org.uk/" target="_blank">CLYDE</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO085176&amp;z=126">Culteuchar &amp; Dron</a></td>
				<td>Forgandenny</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO085176&amp;z=126">NO085176</a></td></tr><tr style="background-color: #EEE"><td>Thu 01/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76185&amp;bpg=">Summer series 13</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Darling How</td>
				<td>Cockermouth</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Fri 02/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73301&amp;bpg=">Scottish Six Days - Strathearn 2019 - Day 5</a></td>
				<td>National</td>
				<td><a href="http://taysideorienteers.org.uk" target="_blank">TAY</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO006468&amp;z=126">Craig a'Barns</a></td>
				<td>Dunkeld</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO006468&amp;z=126">NO006468</a></td></tr><tr style="background-color: #EEE"><td>Sat 03/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73302&amp;bpg=">Scottish Six Days - Strathearn 2019 - Day 6 (UKOL)</a></td>
				<td>National</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN925528&amp;z=126">Grandtully</a></td>
				<td>Grandtully</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN925528&amp;z=126">NN925528</a></td></tr><tr style="background-color: #FFF"><td>Sat 03/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75218&amp;bpg=">Wolds' Mini-Mountain Marathon </a></td>
				<td>Local</td>
				<td><a href="http://www.logonline.org.uk" target="_blank">LOG</a></td>
				<td>EMOA</td>
				<td></td>
				<td>Horncastle</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 03/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75979&amp;bpg=">Wim/WSX Activate event</a></td>
				<td>Local</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH24 2ET&amp;z=126">Moors Valley Country Park</a></td>
				<td>Ringwood</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH24 2ET&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 06/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76379&amp;bpg=">Wrekin Summer Series 12</a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ544147&amp;z=126">Haughmond Hill </a></td>
				<td>Shrewsbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ544147&amp;z=126">SJ544147</a></td></tr><tr style="background-color: #EEE"><td>Tue 06/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76404&amp;bpg=">NWO Summer Street O Series</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU148830&amp;z=126">Old Town</a></td>
				<td>Swindon</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU148830&amp;z=126">SU148830</a></td></tr><tr style="background-color: #FFF"><td>Wed 07/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75492&amp;bpg=">WEE 9</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 07/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75518&amp;bpg=">OD Summer Evening Event - War Memorial Park</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP322772&amp;z=126">War Memorial Park</a></td>
				<td>Coventry</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP322772&amp;z=126">SP322772</a></td></tr><tr style="background-color: #FFF"><td>Wed 07/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76257&amp;bpg=">ESOC Sprintelope</a></td>
				<td>Local</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td></td>
				<td>Edinburgh</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 07/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76344&amp;bpg=">GRAMP Summer Series - Perwinnes Moss</a></td>
				<td>Local</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ935115&amp;z=126">Perwinnes Moss</a></td>
				<td>Aberdeen</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NJ935115&amp;z=126">NJ935115</a></td></tr><tr style="background-color: #FFF"><td>Wed 07/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26662&amp;bpg=">Attingham Sunny Summer Wednesdays 2</a></td>
				<td>Activity</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SY4 4TP&amp;z=126">Attingham Park ( NT) </a></td>
				<td>Shrewsbury </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SY4 4TP&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Thu 08/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75965&amp;bpg=">LEI Summer League 15</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK436167&amp;z=126">Cademan and Thringstone Woods</a></td>
				<td>Whitwick</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK436167&amp;z=126">SK436167</a></td></tr><tr style="background-color: #FFF"><td>Thu 08/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76186&amp;bpg=">Summer series 14</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Southerndale</td>
				<td>Keswick</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 10/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74960&amp;bpg=">Chairman's Challenge and Social</a></td>
				<td>Local</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td>tbc</td>
				<td>Cinderford</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 10/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75627&amp;bpg=">Swadlincote Woodlands</a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK305193&amp;z=126">Foremark Reservoir</a></td>
				<td>Swadlincote</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK305193&amp;z=126">SK305193</a></td></tr><tr style="background-color: #EEE"><td>Sat 10/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76131&amp;bpg=">Summer series 6</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SX092643&amp;z=126">Lanhydrock</a></td>
				<td>Bodmin</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SX092643&amp;z=126">SX092643</a></td></tr><tr style="background-color: #FFF"><td>Sat 10/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76350&amp;bpg=">Summer Series Event </a></td>
				<td>Local</td>
				<td><a href="http://www.wessex-oc.org" target="_blank">WSX</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SZ075945&amp;z=126">Slades Farm</a></td>
				<td>Bournemouth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SZ075945&amp;z=126">SZ075945</a></td></tr><tr style="background-color: #EEE"><td>Sun 11/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74071&amp;bpg=">Buckingham Urban</a></td>
				<td>Regional</td>
				<td><a href="http://www.smoc.info" target="_blank">SMOC</a></td>
				<td>EAOA</td>
				<td>Buckingham</td>
				<td>Buckingham</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 11/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26851&amp;bpg=">OD Photo O - Rugby</a></td>
				<td>Activity</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CV22 5LJ&amp;z=126">Rugby</a></td>
				<td>Rugby</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CV22 5LJ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Mon 12/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71918&amp;bpg=">World Orienteering Championships 12-17 Aug World Cup Round 2</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Norway</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Tue 13/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75966&amp;bpg=">LEI Summer League 16</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK485105&amp;z=126">Markfield</a></td>
				<td>Leicester</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK485105&amp;z=126">SK485105</a></td></tr><tr style="background-color: #EEE"><td>Tue 13/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75980&amp;bpg=">Wim/WSX Activate event</a></td>
				<td>Local</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH21 2BL&amp;z=126">Bytheway Fields,  Leigh Road,  Wimborne BH21 2BL</a></td>
				<td>Wimborne</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH21 2BL&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Tue 13/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76380&amp;bpg=">Wrekin Summer Series 12A</a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO442945&amp;z=126">Cardingmill Valley</a></td>
				<td>Church Stretton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO442945&amp;z=126">SO442945</a></td></tr><tr style="background-color: #EEE"><td>Wed 14/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75493&amp;bpg=">WEE 10</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 14/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75519&amp;bpg=">OD Summer Evening Event - Itchington Holt</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP374588&amp;z=126">Itchington Holt</a></td>
				<td>Harbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP374588&amp;z=126">SP374588</a></td></tr><tr style="background-color: #EEE"><td>Wed 14/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75862&amp;bpg=">SBOC - Summer Sprint Event 1</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Swansea University</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 14/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76218&amp;bpg=">London Park Race Series - Race 8</a></td>
				<td>Local</td>
				<td><a href="http://slow.org.uk/" target="_blank">SLOW</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ300874&amp;z=126">Elthorne Park</a></td>
				<td>London</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ300874&amp;z=126">TQ300874</a></td></tr><tr style="background-color: #EEE"><td>Wed 14/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76345&amp;bpg=">GRAMP Summer Series - Mulloch</a></td>
				<td>Local</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO720912&amp;z=126">Mulloch</a></td>
				<td>Banchory</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO720912&amp;z=126">NO720912</a></td></tr><tr style="background-color: #FFF"><td>Thu 15/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75827&amp;bpg=">SWOC Summer Series 4   </a></td>
				<td>Local</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO196123&amp;z=126">Clydach</a></td>
				<td>Brynmawr</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO196123&amp;z=126">SO196123</a></td></tr><tr style="background-color: #EEE"><td>Thu 15/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76187&amp;bpg=">Summer series 15</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Setmurthy</td>
				<td>Cockermouth</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 17/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=69962&amp;bpg=">Race the Castles in Yorkshire (UKOL) / YHOA Superleague</a></td>
				<td>National</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td>Mam Tor</td>
				<td>Castleton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 17/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75628&amp;bpg=">Rosliston Forestry Centre</a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK243174&amp;z=126">Rosliston Forestry Centre</a></td>
				<td>Swadlincote</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK243174&amp;z=126">SK243174</a></td></tr><tr style="background-color: #FFF"><td>Sat 17/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75982&amp;bpg=">WIM Picnic Event</a></td>
				<td>Local</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU153127&amp;z=126">Hyde and Gorley Commons, New Forest</a></td>
				<td>Fordingbridge, Hants</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU153127&amp;z=126">SU153127</a></td></tr><tr style="background-color: #EEE"><td>Sat 17/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26805&amp;bpg=">MOR Club Championships - Roseisle </a></td>
				<td>Activity</td>
				<td><a href="http://www.moravianorienteering.org" target="_blank">MOR</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV30 2UB&amp;z=126">Roseisle </a></td>
				<td>Forres</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV30 2UB&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 18/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74793&amp;bpg=">East Midlands Urban League 2019/Race the Castles (UKOL)</a></td>
				<td>National</td>
				<td><a href="http://www.logonline.org.uk" target="_blank">LOG</a></td>
				<td>EMOA</td>
				<td>Lincoln City</td>
				<td>Lincoln</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 18/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74948&amp;bpg=">NGOC League 8</a></td>
				<td>Regional</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO890325&amp;z=126">Tewkesbury Town</a></td>
				<td>Tewkesbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO890325&amp;z=126">SO890325</a></td></tr><tr style="background-color: #FFF"><td>Sun 18/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76026&amp;bpg=">OCOUL 4</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT61 9DJ&amp;z=126">Co Armagh - TBC</a></td>
				<td>Armagh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT61 9DJ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Mon 19/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75667&amp;bpg=">Race the Castles in Yorkshire - Urban Sprint</a></td>
				<td>Regional</td>
				<td><a href="http://www.eastpennineoc.org.uk" target="_blank">EPOC</a></td>
				<td>YHOA</td>
				<td>Thornes Park</td>
				<td>Wakefield</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Tue 20/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75668&amp;bpg=">Race the Castles in Yorkshire - Indoor Sprint and Park Sprint</a></td>
				<td>Regional</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE151355&amp;z=126">Bradford Grammar School &amp; Lister Park</a></td>
				<td>Bradford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE151355&amp;z=126">SE151355</a></td></tr><tr style="background-color: #EEE"><td>Tue 20/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76381&amp;bpg=">Wrekin Summer Series 14 </a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO452969&amp;z=126">Plush Hill </a></td>
				<td>Church Stretton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO452969&amp;z=126">SO452969</a></td></tr><tr style="background-color: #FFF"><td>Tue 20/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76421&amp;bpg=">NWO Summer Street O Series</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td>Haydon Wick</td>
				<td>Swindon</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 21/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75494&amp;bpg=">WEE 11</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Wed 21/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75520&amp;bpg=">OD Summer Evening Event - Burton Dassett</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP396519&amp;z=126">Burton Dassett Hills Country Park</a></td>
				<td>Southam</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP396519&amp;z=126">SP396519</a></td></tr><tr style="background-color: #EEE"><td>Wed 21/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75670&amp;bpg=">Knaresborough Castle - Race the Castles in Yorkshire - Urban Middle</a></td>
				<td>Regional</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td>Knaresborough</td>
				<td>Knaresborough</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 21/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75863&amp;bpg=">SBOC - Summer Sprint Event  2 </a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Derwen Fawr</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 21/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75967&amp;bpg=">LEI Summer League 17 &amp; Presentations</a></td>
				<td>Local</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK554083&amp;z=126">Castle Hill Country Park</a></td>
				<td>Leicester</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK554083&amp;z=126">SK554083</a></td></tr><tr style="background-color: #FFF"><td>Wed 21/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75995&amp;bpg=">National Trust Try O'</a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td>TBC</td>
				<td>TBC</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 21/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76346&amp;bpg=">GRAMP Summer Series - Raemoir</a></td>
				<td>Local</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO694995&amp;z=126">Raemoir</a></td>
				<td>Banchory</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO694995&amp;z=126">NO694995</a></td></tr><tr style="background-color: #FFF"><td>Wed 21/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26663&amp;bpg=">Attingham Sunny Summer Wednesdays 3</a></td>
				<td>Activity</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SY4 4TP&amp;z=126">Attingham Park ( NT) </a></td>
				<td>Shrewsbury </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SY4 4TP&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Thu 22/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75671&amp;bpg=">Race the Castles in Yorkshire - Urban Score</a></td>
				<td>Regional</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Beverley</td>
				<td>Beverley</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Thu 22/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76188&amp;bpg=">Summer series 16</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Blakeley Raise</td>
				<td>Egremont</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Fri 23/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75936&amp;bpg=">Race the Castles in Yorkshire - Middle distance</a></td>
				<td>Regional</td>
				<td><a href="http://www.clok.org.uk" target="_blank">CLOK</a></td>
				<td>NEOA</td>
				<td></td>
				<td>Whitby</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 24/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71818&amp;bpg=">Race the Castles in Yorkshire - White Rose</a></td>
				<td>National</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td></td>
				<td>Scarborough</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 24/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75439&amp;bpg=">NI Colour Series 4</a></td>
				<td>Regional</td>
				<td><a href="https://fermoblog.wordpress.com/" target="_blank">FERMO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT92 1ED&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT92 1ED&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 24/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76222&amp;bpg=">Wessex Summer series Score event (draft) </a></td>
				<td>Local</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td>Dinton Park</td>
				<td>Salisbury</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 25/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71819&amp;bpg=">Race the Castles in Yorkshire - White Rose and YHOA Superleague</a></td>
				<td>National</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td></td>
				<td>Scarborough</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 25/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73720&amp;bpg=">MV Urban event</a></td>
				<td>National</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=KT19 8PL&amp;z=126">Epsom</a></td>
				<td>Epsom</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=KT19 8PL&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 25/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75261&amp;bpg=">score and BBQ(bring own food)</a></td>
				<td>Local</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ986570&amp;z=126">Brough Park</a></td>
				<td>Leek</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ986570&amp;z=126">SJ986570</a></td></tr><tr style="background-color: #FFF"><td>Sun 25/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75337&amp;bpg=">ESOC Ultrasprint</a></td>
				<td>Local</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT215595&amp;z=126">Beeslack Wood</a></td>
				<td>Penicuik</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT215595&amp;z=126">NT215595</a></td></tr><tr style="background-color: #EEE"><td>Sun 25/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75695&amp;bpg=">Maroc Regional Event - Glen Feardar</a></td>
				<td>Regional</td>
				<td><a href="http://www.marocscotland.org.uk" target="_blank">MAROC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ab31 4dd&amp;z=126">Glen Feardar</a></td>
				<td>Ballater</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ab31 4dd&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 25/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76132&amp;bpg=">Summer Series 7</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TR1 1TH&amp;z=126">Truro school</a></td>
				<td>Truro</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TR1 1TH&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Mon 26/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71820&amp;bpg=">White Rose Relays</a></td>
				<td>National</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td></td>
				<td>Scarborough</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 28/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75495&amp;bpg=">WEE 12</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT1 5GS&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 28/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75521&amp;bpg=">OD Summer Evening Event - Warwick University</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td>Warwick University</td>
				<td>Coventry</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 28/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75864&amp;bpg=">SBOC - Summer Sprint Event 3</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Brackla Estate</td>
				<td>Bridgend</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 28/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75996&amp;bpg=">National Trust Try O' </a></td>
				<td>Local</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td>TBC</td>
				<td>TBC</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 28/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76347&amp;bpg=">GRAMP Summer Series - Templars Park</a></td>
				<td>Local</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO849998&amp;z=126">Templars Park</a></td>
				<td>Aberdeen</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NO849998&amp;z=126">NO849998</a></td></tr><tr style="background-color: #EEE"><td>Thu 29/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76189&amp;bpg=">Summer series 17</a></td>
				<td>Local</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Whinlatter</td>
				<td>Keswick</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 31/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75225&amp;bpg=">ELO Local Events in Edinburgh and the Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.elo.org.uk" target="_blank">ELO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT516856&amp;z=126">Yellowcraig</a></td>
				<td>Dirleton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT516856&amp;z=126">NT516856</a></td></tr><tr style="background-color: #EEE"><td>Sat 31/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76110&amp;bpg=">PFO Capricorn event</a></td>
				<td>Local</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB10 3JT&amp;z=126">Peel Park to Brun Valley Park</a></td>
				<td>Burnley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB10 3JT&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 31/08/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76431&amp;bpg=">INT Local Events in Edinburgh and The Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.interlopers.org.uk/" target="_blank">INT</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT242694&amp;z=126">Braidburn Valley Park</a></td>
				<td>Edinburgh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT242694&amp;z=126">NT242694</a></td></tr><tr style="background-color: #EEE"><td>Sun 01/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73888&amp;bpg=">TVOC UKUL Urban Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.tvoc.org.uk" target="_blank">TVOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=OX9 3DP&amp;z=126">Thame</a></td>
				<td>Thame</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=OX9 3DP&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 01/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74744&amp;bpg=">STAG Scottish Score Championships 2019</a></td>
				<td>Regional</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td></td>
				<td>Pitlochry</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 01/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74907&amp;bpg=">Askham Common Galoppen</a></td>
				<td>Regional</td>
				<td><a href="http://www.bl-orienteering.org.uk/" target="_blank">BL</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY500216&amp;z=126">Askham Common, Askham</a></td>
				<td>Penrith</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY500216&amp;z=126">NY500216</a></td></tr><tr style="background-color: #FFF"><td>Sun 01/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74949&amp;bpg=">NGOC League 9</a></td>
				<td>Regional</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO512397&amp;z=126">Hereford city</a></td>
				<td>Hereford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO512397&amp;z=126">SO512397</a></td></tr><tr style="background-color: #EEE"><td>Sun 01/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74955&amp;bpg=">Regional event</a></td>
				<td>Regional</td>
				<td><a href="http://www.clok.org.uk" target="_blank">CLOK</a></td>
				<td>NEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ574256&amp;z=126">South Gare</a></td>
				<td>Redcar</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ574256&amp;z=126">NZ574256</a></td></tr><tr style="background-color: #FFF"><td>Sun 01/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75705&amp;bpg=">QO Club Champs</a></td>
				<td>Local</td>
				<td><a href="http://www.quantockorienteers.co.uk" target="_blank">QO</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Taunton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 01/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76283&amp;bpg=">Nairn East Beach</a></td>
				<td>Local</td>
				<td><a href="http://www.invoc.org.uk" target="_blank">INVOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV12 5LF&amp;z=126">Nairn East Beach</a></td>
				<td>Nairn</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV12 5LF&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 07/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71428&amp;bpg=">Senior Home Internationals Individual &amp; 2019 Welsh League Race</a></td>
				<td>National</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Broughton Burrows</td>
				<td>Gower</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 07/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73740&amp;bpg=">Fat Rascal Weekend Sprint Event/YHOA Urban League</a></td>
				<td>Regional</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE360323&amp;z=126">Colton and Temple Newsam</a></td>
				<td>Leeds</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE360323&amp;z=126">SE360323</a></td></tr><tr style="background-color: #FFF"><td>Sat 07/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75629&amp;bpg=">Autumn Trophy 1</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT31 9LT&amp;z=126">Slieve Garron</a></td>
				<td>Dromara</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT31 9LT&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 07/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75836&amp;bpg=">SOC Local </a></td>
				<td>Local</td>
				<td><a href="http://southampton-orienteers.org.uk" target="_blank">SOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU406057&amp;z=126">Dibden Inclosure, New Forest</a></td>
				<td>Dibden Purlieu</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU406057&amp;z=126">SU406057</a></td></tr><tr style="background-color: #FFF"><td>Sat 07/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75981&amp;bpg=">Wim/WSX Activate event</a></td>
				<td>Local</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH21 1AN&amp;z=126">Wimborne, Dorset</a></td>
				<td>Wimborne</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BH21 1AN&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 08/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71317&amp;bpg=">Peter Palmer Junior Team Relays</a></td>
				<td>National</td>
				<td><a href="http://www.saxons-oc.org" target="_blank">SAX</a></td>
				<td>SEOA</td>
				<td>Hindleap Warren</td>
				<td>East Grinstead</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 08/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71429&amp;bpg="> Senior Home Internationals Relays (&amp; Local Race)</a></td>
				<td>National</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Whiteford Burrows</td>
				<td>Gower</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 08/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73636&amp;bpg=">CompassPoint Scottish Orienteering League 4</a></td>
				<td>National</td>
				<td><a href="http://www.interlopers.org.uk/" target="_blank">INT</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN770457&amp;z=126">Drummond Hill</a></td>
				<td>Kenmore</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NN770457&amp;z=126">NN770457</a></td></tr><tr style="background-color: #FFF"><td>Sun 08/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73741&amp;bpg=">Fat Rascal Weekend Urban Event/YHOA Urban League</a></td>
				<td>Regional</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td>Leeds City Centre</td>
				<td>Leeds</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 08/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75141&amp;bpg=">Keyne-O, Campbell Park</a></td>
				<td>Local</td>
				<td><a href="http://www.smoc.info" target="_blank">SMOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=MK9 4AJ&amp;z=126">Campbell Park</a></td>
				<td>Milton Keynes</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=MK9 4AJ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 08/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75191&amp;bpg=">NOR colour coded</a></td>
				<td>Local</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Norfolk</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 08/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75428&amp;bpg=">The John Bennison Long O </a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO451936&amp;z=126">Church Stretton </a></td>
				<td>Church Stretton </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO451936&amp;z=126">SO451936</a></td></tr><tr style="background-color: #FFF"><td>Sun 08/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76133&amp;bpg=">Forest League 1</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SW837397&amp;z=126">Trelissick</a></td>
				<td>Truro</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SW837397&amp;z=126">SW837397</a></td></tr><tr style="background-color: #EEE"><td>Mon 09/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75924&amp;bpg=">WIM/WSX Monthly Evening event </a></td>
				<td>Local</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td>Avon Heath TBC</td>
				<td>Ringwood - venue TBC</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Mon 09/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26441&amp;bpg=">BL Club Night, Rickerby Park</a></td>
				<td>Activity</td>
				<td><a href="http://www.bl-orienteering.org.uk/" target="_blank">BL</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CA3 9AF&amp;z=126">Rickerby Park</a></td>
				<td>Carlisle</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CA3 9AF&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Tue 10/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76422&amp;bpg=">NWO Summer Street O Series</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td>Royal Wootton Bassett</td>
				<td>Royal Wootton Bassett</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 14/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71310&amp;bpg=">British Sprint Championships (UKOL)</a></td>
				<td>Major</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td>Loughborough University</td>
				<td>Loughborough</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 14/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76111&amp;bpg=">PFO Autumn Series 1 of 4</a></td>
				<td>Local</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td>Nuttall Park</td>
				<td>Ramsbottom</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 14/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76232&amp;bpg=">MOR Saturday and Schools League - Findhorn</a></td>
				<td>Local</td>
				<td><a href="http://www.moravianorienteering.org" target="_blank">MOR</a></td>
				<td>SOA</td>
				<td></td>
				<td>Forres</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 15/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71311&amp;bpg=">British Middle Distance Championships (UKOL)</a></td>
				<td>Major</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK035836&amp;z=126">Chinley Churn</a></td>
				<td>Chapel-en-le-Frith</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK035836&amp;z=126">SK035836</a></td></tr><tr style="background-color: #FFF"><td>Sun 15/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75702&amp;bpg=">QOFL 1</a></td>
				<td>Local</td>
				<td><a href="http://www.quantockorienteers.co.uk" target="_blank">QO</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Taunton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 15/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26867&amp;bpg=">STAG Technical Training day</a></td>
				<td>Activity</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>TBC</td>
				<td>Pitlochry</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Fri 20/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75561&amp;bpg=">LOK City of London Race Friday</a></td>
				<td>Regional</td>
				<td><a href="http://www.londonorienteering.co.uk" target="_blank">LOK</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ301832&amp;z=126">Kings Cross</a></td>
				<td>King's Cross</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ301832&amp;z=126">TQ301832</a></td></tr><tr style="background-color: #EEE"><td>Sat 21/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72464&amp;bpg=">City of London Race</a></td>
				<td>National</td>
				<td><a href="http://slow.org.uk/" target="_blank">SLOW</a></td>
				<td>SEOA</td>
				<td></td>
				<td>London</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 21/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72903&amp;bpg=">Veteran Home Internationals Relays</a></td>
				<td>National</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td>Edinburgh area</td>
				<td>Edinburgh area</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 21/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75828&amp;bpg=">SWOC  League 8</a></td>
				<td>Local</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST117833&amp;z=126">Gwaelod y Garth</a></td>
				<td>Cardiff</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST117833&amp;z=126">ST117833</a></td></tr><tr style="background-color: #FFF"><td>Sat 21/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76112&amp;bpg=">PFO Autumn Series 2 of 4</a></td>
				<td>Local</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td>Marsden Park</td>
				<td>Nelson</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 21/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76214&amp;bpg=">SROC autumn series 1</a></td>
				<td>Local</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LA1 4WY&amp;z=126">Lancaster University</a></td>
				<td>Lancaster</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LA1 4WY&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 21/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76269&amp;bpg=">OD Saturday Morning Event - National Herb Centre</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP410471&amp;z=126">National Herb Centre</a></td>
				<td>Warmington, Banbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP410471&amp;z=126">SP410471</a></td></tr><tr style="background-color: #EEE"><td>Sun 22/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72902&amp;bpg=">CompassPoint Scottish Orienteering League 5 incorporating Veteran Home Internationals Individual</a></td>
				<td>National</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td>Edinburgh area</td>
				<td>Edinburgh area</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 22/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73742&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>Harrogate</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 22/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74544&amp;bpg=">LOC Cumbrian Galoppen</a></td>
				<td>Regional</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td>Birkett Common TBC</td>
				<td>Kirby Stephen</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 22/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74833&amp;bpg=">SOS Colour Coded - Baddow Ridge</a></td>
				<td>Regional</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td>TBD</td>
				<td>Colchester</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 22/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75264&amp;bpg=">Whitfield valley-  west mids relays</a></td>
				<td>Local</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ887508&amp;z=126">Whitfield valley country park- </a></td>
				<td>Burslem</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ887508&amp;z=126">SJ887508</a></td></tr><tr style="background-color: #FFF"><td>Sun 22/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75396&amp;bpg=">NWO Urban Event</a></td>
				<td>Regional</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU119844&amp;z=126">West Swindon</a></td>
				<td>Swindon</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU119844&amp;z=126">SU119844</a></td></tr><tr style="background-color: #EEE"><td>Sun 22/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76084&amp;bpg=">BOK Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST556712&amp;z=126">Ashton Court Estate</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST556712&amp;z=126">ST556712</a></td></tr><tr style="background-color: #FFF"><td>Thu 26/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73684&amp;bpg=">World Cup Round 3 26 - 29 Sept</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Switzerland</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 28/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71314&amp;bpg=">Junior Inter Regional Championships</a></td>
				<td>National</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK125903&amp;z=126">Cowms Rocks</a></td>
				<td>Bamford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK125903&amp;z=126">SK125903</a></td></tr><tr style="background-color: #FFF"><td>Sat 28/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72589&amp;bpg=">Caddihoe Chase Day 1 - SWOA South West Long Distance Championships</a></td>
				<td>National</td>
				<td><a href="http://www.devonorienteering.co.uk" target="_blank">DEVON</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SX553658&amp;z=126">Burrator</a></td>
				<td>Yelverton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SX553658&amp;z=126">SX553658</a></td></tr><tr style="background-color: #EEE"><td>Sat 28/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75226&amp;bpg=">ELO Local Events in Edinburgh and the Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.elo.org.uk" target="_blank">ELO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT675783&amp;z=126">Hallhill</a></td>
				<td>Dunbar</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT675783&amp;z=126">NT675783</a></td></tr><tr style="background-color: #FFF"><td>Sat 28/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76113&amp;bpg=">PFO Autumn Series 3 of 4</a></td>
				<td>Local</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td>Wilson Field</td>
				<td>Clayton-Le-Moors, Accrington</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 29/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71315&amp;bpg=">Junior Inter Regional Championships</a></td>
				<td>National</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td>Tankersley</td>
				<td>Barnsley</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 29/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72590&amp;bpg=">Caddihoe Chase Day 2 - Chasing Start</a></td>
				<td>National</td>
				<td><a href="http://www.devonorienteering.co.uk" target="_blank">DEVON</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SX553658&amp;z=126">Burrator</a></td>
				<td>Yelverton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SX553658&amp;z=126">SX553658</a></td></tr><tr style="background-color: #EEE"><td>Sun 29/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74282&amp;bpg=">Weald Park</a></td>
				<td>Regional</td>
				<td><a href="http://orienteering-havoc.co.uk" target="_blank">HAVOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ573940&amp;z=126">Weald Park</a></td>
				<td>Brentwood</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ573940&amp;z=126">TQ573940</a></td></tr><tr style="background-color: #FFF"><td>Sun 29/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74862&amp;bpg=">East Midlands Urban League 2019</a></td>
				<td>Regional</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>Worksop</td>
				<td>Worksop</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 29/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75233&amp;bpg=">Sewingshields regional</a></td>
				<td>Regional</td>
				<td><a href="http://www.newcastleorienteering.org.uk" target="_blank">NATO</a></td>
				<td>NEOA</td>
				<td></td>
				<td>Rothbury</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 29/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75509&amp;bpg=">Post-JIRCS event, probably mass-start score</a></td>
				<td>Local</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td>Tankersley</td>
				<td>Barnsley</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 29/09/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75930&amp;bpg=">INVOC bto SOUL9</a></td>
				<td>Regional</td>
				<td><a href="http://www.invoc.org.uk" target="_blank">INVOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV12 4ES&amp;z=126">Nairn</a></td>
				<td>Nairn</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV12 4ES&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Fri 04/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73685&amp;bpg=">Junior European Cup 4-6 Oct???</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>??</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 05/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72119&amp;bpg=">EuroCity Race Tour - Everton Brow</a></td>
				<td>National</td>
				<td><a href="http://www.deeside-orienteering-club.org.uk" target="_blank">DEE</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ350925&amp;z=126">Everton Brow</a></td>
				<td>Liverpool</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ350925&amp;z=126">SJ350925</a></td></tr><tr style="background-color: #FFF"><td>Sat 05/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73858&amp;bpg=">Autumn in Anglia Day 1: West Harling</a></td>
				<td>Regional</td>
				<td><a href="http://www.suffoc.co.uk" target="_blank">SUFFOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IP24 2RX&amp;z=126">West Harling</a></td>
				<td>Thetford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IP24 2RX&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 05/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76050&amp;bpg=">INT Local Events in Edinburgh and The Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.interlopers.org.uk/" target="_blank">INT</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT262684&amp;z=126">Mortonhall</a></td>
				<td>Edinburgh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT262684&amp;z=126">NT262684</a></td></tr><tr style="background-color: #FFF"><td>Sat 05/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76114&amp;bpg=">PFO Autumn Series 4 of 4</a></td>
				<td>Local</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td>Dean Clough</td>
				<td>Great Harwood</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 05/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76233&amp;bpg=">MOR Saturday and Schools League- Lossiemouth</a></td>
				<td>Local</td>
				<td><a href="http://www.moravianorienteering.org" target="_blank">MOR</a></td>
				<td>SOA</td>
				<td></td>
				<td>Lossiemouth</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 05/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76270&amp;bpg=">OD Saturday Morning Event Including the Tony Haw Score</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP205958&amp;z=126">Kingsbury Water Park</a></td>
				<td>Tamworth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP205958&amp;z=126">SP205958</a></td></tr><tr style="background-color: #EEE"><td>Sun 06/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72148&amp;bpg=">European City Race Tour - Liverpool</a></td>
				<td>National</td>
				<td><a href="http://www.seloc.org.uk" target="_blank">SELOC</a></td>
				<td>NWOA</td>
				<td>Liverpool City Centre</td>
				<td>Liverpool</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 06/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73556&amp;bpg=">SAX Urban event</a></td>
				<td>National</td>
				<td><a href="http://www.saxons-oc.org" target="_blank">SAX</a></td>
				<td>SEOA</td>
				<td>Kings Hill West Malling</td>
				<td>West Malling</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 06/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74538&amp;bpg=">2019 Welsh League Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Pen Rhiw Wen</td>
				<td>Ystalyfera</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 06/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74920&amp;bpg=">Cumbrian Galoppen - Uldale Fells</a></td>
				<td>Regional</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY252333&amp;z=126">Uldale Fells</a></td>
				<td>Keswick</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY252333&amp;z=126">NY252333</a></td></tr><tr style="background-color: #EEE"><td>Sun 06/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74956&amp;bpg=">Regional event</a></td>
				<td>Regional</td>
				<td><a href="http://www.clok.org.uk" target="_blank">CLOK</a></td>
				<td>NEOA</td>
				<td>Fylingdales Moor</td>
				<td>Whitby</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 06/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75147&amp;bpg=">Dorset Delight</a></td>
				<td>Regional</td>
				<td><a href="http://www.wessex-oc.org" target="_blank">WSX</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Poole</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 06/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75362&amp;bpg=">Autumn in Anglia Day 2: Bury St Edmunds Urban</a></td>
				<td>Regional</td>
				<td><a href="http://www.suffoc.co.uk" target="_blank">SUFFOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TL856642&amp;z=126">Bury St Edmunds</a></td>
				<td>Bury St Edmunds</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TL856642&amp;z=126">TL856642</a></td></tr><tr style="background-color: #FFF"><td>Sun 06/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75381&amp;bpg=">WMOA League Event 8 Oldacre Valley</a></td>
				<td>Regional</td>
				<td><a href="http://www.walton-chasers.co.uk" target="_blank">WCH</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST17 0SG&amp;z=126">Oldacre Valley</a></td>
				<td>Stafford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST17 0SG&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 06/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75893&amp;bpg=">GRAMP Forvie - Regional</a></td>
				<td>Regional</td>
				<td><a href="http://www.grampoc.com" target="_blank">GRAMP</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NK034289&amp;z=126">Forvie</a></td>
				<td>Newburgh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NK034289&amp;z=126">NK034289</a></td></tr><tr style="background-color: #FFF"><td>Sun 06/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76036&amp;bpg=">BKO Regional Event SCOL (Bucklebury Common)</a></td>
				<td>Regional</td>
				<td><a href="http://www.bko.org.uk" target="_blank">BKO</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU571696&amp;z=126">Bucklebury Common</a></td>
				<td>Thatcham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU571696&amp;z=126">SU571696</a></td></tr><tr style="background-color: #EEE"><td>Sun 06/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76051&amp;bpg=">INT SoSOL</a></td>
				<td>Regional</td>
				<td><a href="http://www.interlopers.org.uk/" target="_blank">INT</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS984805&amp;z=126">Kinneil Wood</a></td>
				<td>Bo'ness</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS984805&amp;z=126">NS984805</a></td></tr><tr style="background-color: #FFF"><td>Sat 12/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71318&amp;bpg=">British Schools Score Championships</a></td>
				<td>National</td>
				<td><a href="http://www.mdoc.org.uk" target="_blank">MDOC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD830045&amp;z=126">Heaton Park</a></td>
				<td>Manchester</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD830045&amp;z=126">SD830045</a></td></tr><tr style="background-color: #EEE"><td>Sat 12/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72344&amp;bpg=">25manna</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Sweden</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 12/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72900&amp;bpg=">Junior Home Internationals Individual</a></td>
				<td>National</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT34 3EH&amp;z=126">Cassey Water</a></td>
				<td>Rostrevor</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT34 3EH&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 12/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74915&amp;bpg=">Watermillock Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.bl-orienteering.org.uk/" target="_blank">BL</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY998264&amp;z=126">Watermillock Common, Dockray</a></td>
				<td>Penrith</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY998264&amp;z=126">NY998264</a></td></tr><tr style="background-color: #FFF"><td>Sat 12/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75444&amp;bpg=">NI Open Orienteering Championships</a></td>
				<td>Regional</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT34 3AE&amp;z=126">Casey Water</a></td>
				<td>Rostrevor</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT34 3AE&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 12/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75837&amp;bpg=">SOC Local</a></td>
				<td>Local</td>
				<td><a href="http://southampton-orienteers.org.uk" target="_blank">SOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU230140&amp;z=126">New Forest</a></td>
				<td>Fritham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU230140&amp;z=126">SU230140</a></td></tr><tr style="background-color: #FFF"><td>Sun 13/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72557&amp;bpg=">YHOA Championships and YHOA Superleague</a></td>
				<td>National</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td>Wombwell</td>
				<td>Sheffield</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 13/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72901&amp;bpg=">Junior Home Internationals Relays</a></td>
				<td>National</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT33 0GR&amp;z=126">Donard Forest Park</a></td>
				<td>Newcastle</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT33 0GR&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 13/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73637&amp;bpg=">CompassPoint Scottish Orienteering League 6</a></td>
				<td>National</td>
				<td><a href="http://roxburghreivers.org.uk" target="_blank">RR</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT406054&amp;z=126">Teviothead</a></td>
				<td>Hawick</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT406054&amp;z=126">NT406054</a></td></tr><tr style="background-color: #EEE"><td>Sun 13/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74795&amp;bpg=">East Midlands Urban League 2019</a></td>
				<td>Regional</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK359170&amp;z=126">Ashby Urban</a></td>
				<td>Ashby</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK359170&amp;z=126">SK359170</a></td></tr><tr style="background-color: #FFF"><td>Sun 13/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74962&amp;bpg=">NGOC League 10</a></td>
				<td>Local</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO870118&amp;z=126">Painswick Beacon</a></td>
				<td>Stroud</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO870118&amp;z=126">SO870118</a></td></tr><tr style="background-color: #EEE"><td>Sun 13/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75142&amp;bpg=">Keyne-O, Shenley Wood</a></td>
				<td>Local</td>
				<td><a href="http://www.smoc.info" target="_blank">SMOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=MK5 6AA&amp;z=126">Shenley Wood</a></td>
				<td>Milton Keynes</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=MK5 6AA&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 13/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75192&amp;bpg=">North Norfolk</a></td>
				<td>Regional</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td>North Norfolk</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 13/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75378&amp;bpg=">Devon Galoppen and League Event 1</a></td>
				<td>Regional</td>
				<td><a href="http://www.devonorienteering.co.uk" target="_blank">DEVON</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SX531751&amp;z=126">Whitchurch Common</a></td>
				<td>Princetown, Dartmoor</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SX531751&amp;z=126">SX531751</a></td></tr><tr style="background-color: #FFF"><td>Sun 13/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75562&amp;bpg=">HH Regional</a></td>
				<td>Regional</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td>Ashridge North</td>
				<td>tbc</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 13/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75563&amp;bpg=">SO Regional event</a></td>
				<td>Regional</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>Rewell</td>
				<td>Arundel</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 19/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73745&amp;bpg=">Regional Urban Event</a></td>
				<td>Regional</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td>Hessle and Humber Bridge</td>
				<td>Hessle</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 19/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74935&amp;bpg=">ESOC Local Events in Edinburgh and the Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT212676&amp;z=126">Bonaly</a></td>
				<td>Edinburgh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT212676&amp;z=126">NT212676</a></td></tr><tr style="background-color: #FFF"><td>Sat 19/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75788&amp;bpg=">Tyn y Coed  SWOC League 9</a></td>
				<td>Local</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST083828&amp;z=126">Creigiau</a></td>
				<td>Cardiff</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST083828&amp;z=126">ST083828</a></td></tr><tr style="background-color: #EEE"><td>Sat 19/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75932&amp;bpg=">NWO Four Colour Event</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU246686&amp;z=126">Hens Wood</a></td>
				<td>Marlborough</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU246686&amp;z=126">SU246686</a></td></tr><tr style="background-color: #FFF"><td>Sat 19/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75997&amp;bpg=">BKO Saturday event</a></td>
				<td>Local</td>
				<td><a href="http://www.bko.org.uk" target="_blank">BKO</a></td>
				<td>SCOA</td>
				<td></td>
				<td>Bracknell</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 19/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76085&amp;bpg=">BOK Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST769655&amp;z=126">Bathampton Down</a></td>
				<td>Bath</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST769655&amp;z=126">ST769655</a></td></tr><tr style="background-color: #FFF"><td>Sat 19/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76215&amp;bpg=">SROC autumn series 2</a></td>
				<td>Local</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LA1 1UX&amp;z=126">Williamson Park</a></td>
				<td>Lancaster</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LA1 1UX&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 20/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71312&amp;bpg=">CompassSport Cup Final</a></td>
				<td>Major</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TN22 3HW&amp;z=126">Pippingford Park</a></td>
				<td>Crowborough</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TN22 3HW&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 20/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76027&amp;bpg=">OCOUL 5</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT61 9DJ&amp;z=126">Co Armagh - TBC</a></td>
				<td>Armagh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT61 9DJ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 20/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76134&amp;bpg=">Forest League 2</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td>Mt Edgcumbe Country Park</td>
				<td>Torpoint</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Fri 25/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74258&amp;bpg=">World Cup Round 4 25-29 Oct</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>China</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 26/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72097&amp;bpg=">Cambridge City Race 2019</a></td>
				<td>National</td>
				<td><a href="http://www.cuoc.org.uk" target="_blank">CUOC</a></td>
				<td>EAOA</td>
				<td>Cambridge</td>
				<td>Cambridge</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 26/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73153&amp;bpg=">October Odyssey day 1 urban</a></td>
				<td>National</td>
				<td><a href="http://www.newcastleorienteering.org.uk" target="_blank">NATO</a></td>
				<td>NEOA</td>
				<td>Hexham</td>
				<td>Hexham</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 26/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74109&amp;bpg=">East Midlands League 2019</a></td>
				<td>Regional</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK265799&amp;z=126">Longshaw</a></td>
				<td>Sheffield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK265799&amp;z=126">SK265799</a></td></tr><tr style="background-color: #FFF"><td>Sat 26/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75227&amp;bpg=">ELO Local Events in Edinburgh and the Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.elo.org.uk" target="_blank">ELO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT552842&amp;z=126">North Berwick Law</a></td>
				<td>North Berwick</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT552842&amp;z=126">NT552842</a></td></tr><tr style="background-color: #EEE"><td>Sat 26/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75442&amp;bpg=">NI Colour Series 5</a></td>
				<td>Regional</td>
				<td><a href="https://fermoblog.wordpress.com/" target="_blank">FERMO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT92 1ED&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT92 1ED&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 26/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76348&amp;bpg=">TVOC Waddesdon Manor</a></td>
				<td>Local</td>
				<td><a href="http://www.tvoc.org.uk" target="_blank">TVOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP744163&amp;z=126">Waddesdon Manor National Trust</a></td>
				<td>Aylesbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP744163&amp;z=126">SP744163</a></td></tr><tr style="background-color: #EEE"><td>Sun 27/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73154&amp;bpg=">October Odyssey day 2 &amp; NEOA champs</a></td>
				<td>National</td>
				<td><a href="http://www.newcastleorienteering.org.uk" target="_blank">NATO</a></td>
				<td>NEOA</td>
				<td>Dukes House Woods</td>
				<td>Hexham</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 27/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74848&amp;bpg=">Sarum Galoppen</a></td>
				<td>Regional</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td>Collingbourne?</td>
				<td>Ludgershall</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 27/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75363&amp;bpg=">Ferry Meadows Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.waoc.org.uk" target="_blank">WAOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PE2 5UU&amp;z=126">Ferry Meadows</a></td>
				<td>Peterborough</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PE2 5UU&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 27/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75481&amp;bpg=">GO Autumn Amble</a></td>
				<td>Regional</td>
				<td><a href="http://www.guildfordorienteers.co.uk" target="_blank">GO</a></td>
				<td>SEOA</td>
				<td></td>
				<td>Guildford</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 27/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75923&amp;bpg=">Clyde Erskine Urban race incorporating bto SOUL10</a></td>
				<td>Regional</td>
				<td><a href="http://www.clydesideorienteers.org.uk/" target="_blank">CLYDE</a></td>
				<td>SOA</td>
				<td>Erskine town centre</td>
				<td>Erskine</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 30/10/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75865&amp;bpg=">SBOC - Night League 1</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Clyne Valley (south)</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Fri 01/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76415&amp;bpg=">BAOC Wessex Night League-Southsea</a></td>
				<td>Local</td>
				<td><a href="http://www.baoc.info/" target="_blank">BAOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PO5 2PL&amp;z=126">Southsea Seafront</a></td>
				<td>Portsmouth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=PO5 2PL&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 02/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73753&amp;bpg=">YHOA Night League</a></td>
				<td>Regional</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK400863&amp;z=126">Loxley</a></td>
				<td>Sheffield</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK400863&amp;z=126">SK400863</a></td></tr><tr style="background-color: #EEE"><td>Sat 02/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73811&amp;bpg=">Chichester City Race (UKOL)</a></td>
				<td>National</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>Chichester</td>
				<td>Chichester</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 02/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75630&amp;bpg=">Autumn Trophy 2</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT34 3AA&amp;z=126">Kilbroney Forest</a></td>
				<td>Rostrevor</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT34 3AA&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 02/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75682&amp;bpg=">2019 Welsh League race</a></td>
				<td>Regional</td>
				<td><a href="https://www.eryri-orienteering.org/" target="_blank">ERYRI</a></td>
				<td>WOA</td>
				<td>Newborough Forest</td>
				<td>Newborough</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 02/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76216&amp;bpg=">SROC autumn series 3</a></td>
				<td>Local</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LA5 0UJ&amp;z=126">Eaves Wood</a></td>
				<td>Silverdale</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=LA5 0UJ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 02/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76395&amp;bpg=">NWO Night Event</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU261945&amp;z=126">Badbury Hill</a></td>
				<td>Swindon</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU261945&amp;z=126">SU261945</a></td></tr><tr style="background-color: #FFF"><td>Sun 03/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=68960&amp;bpg=">November Classic (UKOL)</a></td>
				<td>National</td>
				<td><a href="http://southampton-orienteers.org.uk" target="_blank">SOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO15 1AL&amp;z=126">Bramshaw</a></td>
				<td>Southampton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO15 1AL&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 03/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73744&amp;bpg=">YHOA Superleague</a></td>
				<td>Regional</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td>Adderstone, Dalby</td>
				<td>Pickering</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 03/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74283&amp;bpg=">Langdon Hills</a></td>
				<td>Regional</td>
				<td><a href="http://orienteering-havoc.co.uk" target="_blank">HAVOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ680865&amp;z=126">Langdon Hills</a></td>
				<td>Langdon</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ680865&amp;z=126">TQ680865</a></td></tr><tr style="background-color: #EEE"><td>Sun 03/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74860&amp;bpg=">East Midlands League 2019</a></td>
				<td>Regional</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>Shirebrook Wood</td>
				<td>Mansfield</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 03/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74908&amp;bpg=">High Pike Cumbrian Galloppen</a></td>
				<td>Regional</td>
				<td><a href="http://www.bl-orienteering.org.uk/" target="_blank">BL</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY334535&amp;z=126">High Pike, Nr Caldbeck</a></td>
				<td>Penrith</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY334535&amp;z=126">NY334535</a></td></tr><tr style="background-color: #EEE"><td>Sun 03/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75262&amp;bpg=">Leek Urban  -local</a></td>
				<td>Local</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ986570&amp;z=126">Leek town </a></td>
				<td>LEEK</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ986570&amp;z=126">SJ986570</a></td></tr><tr style="background-color: #FFF"><td>Sun 03/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75675&amp;bpg=">2019 Welsh League race (could be part of a weekend)</a></td>
				<td>Regional</td>
				<td><a href="https://www.eryri-orienteering.org/" target="_blank">ERYRI</a></td>
				<td>WOA</td>
				<td>Newborough Forest</td>
				<td>Newborough</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 03/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76171&amp;bpg=">FVO SoSOL</a></td>
				<td>Regional</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS893795&amp;z=126">Callendar Park</a></td>
				<td>Falkirk</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS893795&amp;z=126">NS893795</a></td></tr><tr style="background-color: #FFF"><td>Mon 04/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75925&amp;bpg=">WIM/WSX Monthly Evening event </a></td>
				<td>Local</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td>Wareham, Dorset</td>
				<td>Wareham, Dorset</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 09/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73652&amp;bpg=">Twin Peak Day 1</a></td>
				<td>National</td>
				<td><a href="http://www.mdoc.org.uk" target="_blank">MDOC</a></td>
				<td>NWOA</td>
				<td></td>
				<td>Buxton</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 09/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74963&amp;bpg=">NGOC League 11</a></td>
				<td>Local</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO571128&amp;z=126">Headless Hill</a></td>
				<td>Coleford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO571128&amp;z=126">SO571128</a></td></tr><tr style="background-color: #EEE"><td>Sat 09/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75443&amp;bpg=">NI Colour Series 6</a></td>
				<td>Regional</td>
				<td><a href="http://www.nwoc.info" target="_blank">NWOC</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT49 0LP&amp;z=126">Magilligan</a></td>
				<td>Limavady</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT49 0LP&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 10/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73653&amp;bpg=">Twin Peak Day 2</a></td>
				<td>National</td>
				<td><a href="http://www.mdoc.org.uk" target="_blank">MDOC</a></td>
				<td>NWOA</td>
				<td></td>
				<td>Buxton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 10/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73889&amp;bpg=">TVOC Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.tvoc.org.uk" target="_blank">TVOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=HP22 5NQ&amp;z=126">Wendover Woods</a></td>
				<td>Wendover</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=HP22 5NQ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 10/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75193&amp;bpg=">East Anglian Schools Championships</a></td>
				<td>Regional</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td>South Norfolk</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 10/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75413&amp;bpg=">WMOA League Event  9 Postenplain</a></td>
				<td>Regional</td>
				<td><a href="http://www.harlequins.org.uk" target="_blank">HOC</a></td>
				<td>WMOA</td>
				<td>Postenplain</td>
				<td>Bewdely</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 10/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75547&amp;bpg=">SAX Regional</a></td>
				<td>Regional</td>
				<td><a href="http://www.saxons-oc.org" target="_blank">SAX</a></td>
				<td>SEOA</td>
				<td>Eridge</td>
				<td>tbc</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 10/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75696&amp;bpg=">Maroc Regional Event - Cambus</a></td>
				<td>Regional</td>
				<td><a href="http://www.marocscotland.org.uk" target="_blank">MAROC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ab31 4dd&amp;z=126">Cambus</a></td>
				<td>Ballater</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ab31 4dd&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 10/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75897&amp;bpg=">WIM Galoppen</a></td>
				<td>Regional</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td>New Forest</td>
				<td>Ringwood</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Mon 11/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74849&amp;bpg=">Sarum Wessex NightO</a></td>
				<td>Local</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td>Salisbury?</td>
				<td>Salisbury</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Mon 11/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26442&amp;bpg=">BL Club Night, Penrith</a></td>
				<td>Activity</td>
				<td><a href="http://www.bl-orienteering.org.uk/" target="_blank">BL</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CA11 7PX&amp;z=126">Penrith town</a></td>
				<td>Penrith</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=CA11 7PX&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Wed 13/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75866&amp;bpg=">SBOC - Night League 2 </a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Oxwich Burrows</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 16/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73754&amp;bpg=">Hell Wath, Ripon - YHOA Night League</a></td>
				<td>Regional</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE430469&amp;z=126">Hell Wath, Ripon</a></td>
				<td>Harrogate</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE430469&amp;z=126">SE430469</a></td></tr><tr style="background-color: #EEE"><td>Sat 16/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74936&amp;bpg=">ESOC Local Events in Edinburgh and the Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT203753&amp;z=126">Royal High School and Davidson's Mains Park</a></td>
				<td>Edinburgh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT203753&amp;z=126">NT203753</a></td></tr><tr style="background-color: #FFF"><td>Sat 16/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74965&amp;bpg=">Western Night League</a></td>
				<td>Local</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO859012&amp;z=126">Minchinhampton</a></td>
				<td>Stroud</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO859012&amp;z=126">SO859012</a></td></tr><tr style="background-color: #EEE"><td>Sat 16/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75631&amp;bpg=">Autumn Trophy 3</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT26 6DP&amp;z=126">Hillsborough</a></td>
				<td>Hillsborough</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT26 6DP&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 16/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75829&amp;bpg=">SWOC  League 10</a></td>
				<td>Local</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST142839&amp;z=126">Forest Fawr</a></td>
				<td>Cardiff</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST142839&amp;z=126">ST142839</a></td></tr><tr style="background-color: #EEE"><td>Sat 16/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76271&amp;bpg=">OD Saturday Morning Event - Pooley Country Park</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK257024&amp;z=126">Pooley Country Park</a></td>
				<td>Tamworth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK257024&amp;z=126">SK257024</a></td></tr><tr style="background-color: #FFF"><td>Sun 17/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=71319&amp;bpg=">British Schools Orienteering Championships</a></td>
				<td>National</td>
				<td><a href="http://www.bko.org.uk" target="_blank">BKO</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ005832&amp;z=126">Black Park</a></td>
				<td>Slough</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ005832&amp;z=126">TQ005832</a></td></tr><tr style="background-color: #EEE"><td>Sun 17/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72035&amp;bpg=">SN SE League Event</a></td>
				<td>National</td>
				<td><a href="https://www.southernnavigators.com/" target="_blank">SN</a></td>
				<td>SEOA</td>
				<td>tbc</td>
				<td>tbc</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 17/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73747&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td>Bowden Housteads</td>
				<td>Sheffield</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 17/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74796&amp;bpg=">East Midlands League 2019</a></td>
				<td>Regional</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK573014&amp;z=126">Aylestone Meadows</a></td>
				<td>Leicester</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK573014&amp;z=126">SK573014</a></td></tr><tr style="background-color: #FFF"><td>Sun 17/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74957&amp;bpg=">Regional event</a></td>
				<td>Regional</td>
				<td><a href="http://www.clok.org.uk" target="_blank">CLOK</a></td>
				<td>NEOA</td>
				<td>Dale Town Moor and Boltby Woods</td>
				<td>Thirsk</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 17/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75023&amp;bpg=">WMOA League Event 10 League Event - Shropshire</a></td>
				<td>Regional</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td>To be Confirmed</td>
				<td>Shrewsbury</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 17/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75364&amp;bpg=">Maulden Woods event</a></td>
				<td>Regional</td>
				<td><a href="http://www.waoc.org.uk" target="_blank">WAOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=MK45 3UZ&amp;z=126">Maulden Woods</a></td>
				<td>Bedford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=MK45 3UZ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 17/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75703&amp;bpg=">QOFL 2</a></td>
				<td>Local</td>
				<td><a href="http://www.quantockorienteers.co.uk" target="_blank">QO</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Taunton</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 17/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75983&amp;bpg=">TAY East of Scotland Championships / SoSOL</a></td>
				<td>Regional</td>
				<td><a href="http://taysideorienteers.org.uk" target="_blank">TAY</a></td>
				<td>SOA</td>
				<td>Loch Ordie</td>
				<td>Dunkeld</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 17/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76135&amp;bpg=">Forest League 3</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SW820478&amp;z=126">Idless Woods</a></td>
				<td>Truro</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SW820478&amp;z=126">SW820478</a></td></tr><tr style="background-color: #FFF"><td>Sat 23/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75265&amp;bpg=">Downs banks</a></td>
				<td>Local</td>
				<td><a href="https://www.potoc.co.uk/" target="_blank">POTOC</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ900365&amp;z=126">Downs banks -tbc</a></td>
				<td>Stone </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ900365&amp;z=126">SJ900365</a></td></tr><tr style="background-color: #EEE"><td>Sat 23/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76092&amp;bpg=">Western Night League</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST558787&amp;z=126">Blaise Castle</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST558787&amp;z=126">ST558787</a></td></tr><tr style="background-color: #FFF"><td>Sat 23/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76256&amp;bpg=">SE Night Champs</a></td>
				<td>Regional</td>
				<td><a href="http://www.dfok.co.uk" target="_blank">DFOK</a></td>
				<td>SEOA</td>
				<td>Squerryes Estate</td>
				<td>tbc</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 24/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72036&amp;bpg=">SLOW SE League Event</a></td>
				<td>National</td>
				<td><a href="http://slow.org.uk/" target="_blank">SLOW</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=GU10 2LG&amp;z=126">Hankley Common</a></td>
				<td>Farnham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=GU10 2LG&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 24/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73730&amp;bpg=">Brimham Rocks - YHOA Middle Distance Championships and Superleague</a></td>
				<td>Regional</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE208645&amp;z=126">Brimham Rocks</a></td>
				<td>Harrogate</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE208645&amp;z=126">SE208645</a></td></tr><tr style="background-color: #EEE"><td>Sun 24/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74545&amp;bpg=">LOC Cumbrian Galoppen </a></td>
				<td>Regional</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td>Bethecar </td>
				<td>Oxen Park</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 24/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74834&amp;bpg=">SOS Hylands Park</a></td>
				<td>Regional</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TL679048&amp;z=126">Hylands Park</a></td>
				<td>Chelmsford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TL679048&amp;z=126">TL679048</a></td></tr><tr style="background-color: #EEE"><td>Sun 24/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74861&amp;bpg=">East Midlands Urban League 2019</a></td>
				<td>Regional</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>Nottingham University</td>
				<td>Nottingham</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 24/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75228&amp;bpg=">ELO SoSOL</a></td>
				<td>Regional</td>
				<td><a href="http://www.elo.org.uk" target="_blank">ELO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT776534&amp;z=126">Duns Woods</a></td>
				<td>Duns</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT776534&amp;z=126">NT776534</a></td></tr><tr style="background-color: #EEE"><td>Sun 24/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75771&amp;bpg=">NWO Four Colour Event</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU047693&amp;z=126">Cherhill Down</a></td>
				<td>Calne</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU047693&amp;z=126">SU047693</a></td></tr><tr style="background-color: #FFF"><td>Sun 24/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75867&amp;bpg=">SBOC - Winter League 2</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Pembrey Country Park</td>
				<td>Llanelli </td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 24/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76028&amp;bpg=">OCOUL 6</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT61 9DJ&amp;z=126">Co Armagh - TBC</a></td>
				<td>Armagh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT61 9DJ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 24/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76086&amp;bpg=">BOK Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST558787&amp;z=126">Blaise Castle</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST558787&amp;z=126">ST558787</a></td></tr><tr style="background-color: #EEE"><td>Sun 24/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76284&amp;bpg=">Carse of Ardesier</a></td>
				<td>Regional</td>
				<td><a href="http://www.invoc.org.uk" target="_blank">INVOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV2 7QA&amp;z=126">Carse of Ardesier</a></td>
				<td>Inverness</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IV2 7QA&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 30/11/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76190&amp;bpg=">Southern Night Championships</a></td>
				<td>Regional</td>
				<td><a href="http://www.baoc.info/" target="_blank">BAOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST473909&amp;z=126">Caerwent Trg Camp</a></td>
				<td>Chepstow</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST473909&amp;z=126">ST473909</a></td></tr><tr style="background-color: #EEE"><td>Sun 01/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73750&amp;bpg=">YHOA Superleague</a></td>
				<td>Regional</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td>Shipley Glen</td>
				<td>Bradford</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 01/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73859&amp;bpg=">Daisy's Wood event</a></td>
				<td>Regional</td>
				<td><a href="http://www.suffoc.co.uk" target="_blank">SUFFOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TM345503&amp;z=126">Daisy's Wood</a></td>
				<td>Woodbridge</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TM345503&amp;z=126">TM345503</a></td></tr><tr style="background-color: #EEE"><td>Sun 01/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74110&amp;bpg=">East Midlands League 2019</a></td>
				<td>Regional</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td>Allestree Park</td>
				<td>Derby</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 01/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74154&amp;bpg=">Southern Championships and Mike Nelson BOK Trot (UKOL)</a></td>
				<td>Major</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO620121&amp;z=126">Churchill Inclosure and Cannop Ponds</a></td>
				<td>Coleford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO620121&amp;z=126">SO620121</a></td></tr><tr style="background-color: #EEE"><td>Sun 01/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74399&amp;bpg=">OD WMOA League Event 11 &amp; Club Champs Brandon Woods</a></td>
				<td>Regional</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td>Brandon Woods</td>
				<td>Coventry</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 01/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74745&amp;bpg=">21st Glasgow Parks Championships - Race 1</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>TBC</td>
				<td>Glasgow</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 01/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74746&amp;bpg=">21st Glasgow Parks Championships - Race 2</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>TBC</td>
				<td>Glasgow</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 01/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74747&amp;bpg=">21st Glasgow Parks Championships - Race 3</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>TBC</td>
				<td>Glasgow</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 01/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75564&amp;bpg=">SO Regional event</a></td>
				<td>Regional</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>tbc</td>
				<td>Crawley</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 07/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74916&amp;bpg=">Talkin Tarn Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.bl-orienteering.org.uk/" target="_blank">BL</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY544591&amp;z=126">Talkin Tarn</a></td>
				<td>Brampton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NY544591&amp;z=126">NY544591</a></td></tr><tr style="background-color: #EEE"><td>Sat 07/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74964&amp;bpg=">NGOC League 12</a></td>
				<td>Local</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO650126&amp;z=126">Mallards Pike North</a></td>
				<td>Cinderford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO650126&amp;z=126">SO650126</a></td></tr><tr style="background-color: #FFF"><td>Sat 07/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75746&amp;bpg=">NWNL Darwen Moor</a></td>
				<td>Local</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB3 0PA&amp;z=126">Darwen Moor</a></td>
				<td>Darwen</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB3 0PA&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sat 07/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75838&amp;bpg=">SOC Local</a></td>
				<td>Local</td>
				<td><a href="http://southampton-orienteers.org.uk" target="_blank">SOC</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU247135&amp;z=126">King's Garn</a></td>
				<td>Fritham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU247135&amp;z=126">SU247135</a></td></tr><tr style="background-color: #FFF"><td>Sat 07/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75869&amp;bpg=">SBOC - Night League 3 and Part of Western Night League </a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Kenfig Burrows</td>
				<td>Porthcawl</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 07/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76408&amp;bpg=">BKO Winter Saturday Series (Swinley West)</a></td>
				<td>Local</td>
				<td><a href="http://www.bko.org.uk" target="_blank">BKO</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU901678&amp;z=126">Swinley West</a></td>
				<td>Bracknell</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU901678&amp;z=126">SU901678</a></td></tr><tr style="background-color: #FFF"><td>Sat 07/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;activity=26229&amp;bpg=">Xmas Social</a></td>
				<td>Activity</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT33 0PZ&amp;z=126">TBC</a></td>
				<td>TBC</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT33 0PZ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 08/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=72037&amp;bpg=">CHIG Mitre SE League Event - Middle Distance</a></td>
				<td>National</td>
				<td><a href="http://www.chig.org.uk" target="_blank">CHIG</a></td>
				<td>SEOA</td>
				<td>Epping East</td>
				<td>Theydon Bois</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 08/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73547&amp;bpg=">East Midlands Championships 2019</a></td>
				<td>National</td>
				<td><a href="http://www.logonline.org.uk" target="_blank">LOG</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TF047229&amp;z=126">Grimsthorpe Castle</a></td>
				<td>Bourne</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TF047229&amp;z=126">TF047229</a></td></tr><tr style="background-color: #EEE"><td>Sun 08/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74539&amp;bpg=">2019 Welsh League Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td>Kingswood</td>
				<td>Monmouth</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 08/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75194&amp;bpg=">Shouldham Warren EAL </a></td>
				<td>Regional</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td>Shouldham Warren</td>
				<td>Kings Lynn</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 08/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75234&amp;bpg=">Blyth Local</a></td>
				<td>Local</td>
				<td><a href="http://www.newcastleorienteering.org.uk" target="_blank">NATO</a></td>
				<td>NEOA</td>
				<td></td>
				<td>Blyth</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 08/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75312&amp;bpg=">Tayside Xmas Score</a></td>
				<td>Local</td>
				<td><a href="http://taysideorienteers.org.uk" target="_blank">TAY</a></td>
				<td>SOA</td>
				<td>Dundurn</td>
				<td>Crieff</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 08/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75382&amp;bpg=">WMOA League Event 12 &amp; WM Champs Sherbrook</a></td>
				<td>Regional</td>
				<td><a href="http://www.walton-chasers.co.uk" target="_blank">WCH</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=WS15 2UA&amp;z=126">Sherbrook</a></td>
				<td>Stafford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=WS15 2UA&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 08/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75704&amp;bpg=">QOFL 3</a></td>
				<td>Local</td>
				<td><a href="http://www.quantockorienteers.co.uk" target="_blank">QO</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Taunton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 08/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75747&amp;bpg=">Darwen Moor Day Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.pfo.org.uk" target="_blank">PFO</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB3 0PA&amp;z=126">Darwen Moor</a></td>
				<td>Darwen</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BB3 0PA&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 08/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76136&amp;bpg=">Forest League 4</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SX092643&amp;z=126">Lanhydrock</a></td>
				<td>Bodmin</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SX092643&amp;z=126">SX092643</a></td></tr><tr style="background-color: #EEE"><td>Sat 14/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73755&amp;bpg=">YHOA Night League</a></td>
				<td>Regional</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>East Riding</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 14/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74966&amp;bpg=">Western Night League</a></td>
				<td>Local</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO813005&amp;z=126">Woodchester Park</a></td>
				<td>Stroud</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO813005&amp;z=126">SO813005</a></td></tr><tr style="background-color: #EEE"><td>Sat 14/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75480&amp;bpg=">SO Brighton City Race</a></td>
				<td>Regional</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>Brighton</td>
				<td>Brighton</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 14/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76272&amp;bpg=">OD Saturday Morning Event - Oversley Wood (tbc) </a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP109567&amp;z=126">Pooley Country Park</a></td>
				<td>Alcester</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP109567&amp;z=126">SP109567</a></td></tr><tr style="background-color: #EEE"><td>Sun 15/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73751&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>East Riding</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 15/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=74797&amp;bpg=">East Midlands League 2019</a></td>
				<td>Regional</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK440181&amp;z=126">Cademan and Thringstone Woods</a></td>
				<td>Leicester</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK440181&amp;z=126">SK440181</a></td></tr><tr style="background-color: #EEE"><td>Sun 15/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75557&amp;bpg=">South East Families &amp; Veterans</a></td>
				<td>Regional</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td>Headley Heath</td>
				<td>Dorking</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 15/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75608&amp;bpg=">MWOC local level D</a></td>
				<td>Local</td>
				<td><a href="http://www.mid-wales-orienteers.org.uk" target="_blank">MWOC</a></td>
				<td>WOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SN610940&amp;z=126">Ynys Las</a></td>
				<td>Borth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SN610940&amp;z=126">SN610940</a></td></tr><tr style="background-color: #EEE"><td>Sun 15/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75868&amp;bpg=">SBOC - Winter League 3 and Christmas Social</a></td>
				<td>Local</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td>Three Cliffs, Gower</td>
				<td>Swansea</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 15/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75942&amp;bpg=">Wrekin Club Champs - venue tbc </a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td>To be confirmed</td>
				<td>Shrewsbury </td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 15/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76029&amp;bpg=">OCOUL 7</a></td>
				<td>Local</td>
				<td><a href="http://lvo.org.uk/" target="_blank">LVO</a></td>
				<td>NIOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT61 9DJ&amp;z=126">The Mall, Armagh</a></td>
				<td>Armagh</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=BT61 9DJ&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sat 21/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73756&amp;bpg=">YHOA Night League</a></td>
				<td>Regional</td>
				<td><a href="http://www.eastpennineoc.org.uk" target="_blank">EPOC</a></td>
				<td>YHOA</td>
				<td>Storthes Hall</td>
				<td>Huddersfield</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 22/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73752&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.eastpennineoc.org.uk" target="_blank">EPOC</a></td>
				<td>YHOA</td>
				<td>Storthes Hall</td>
				<td>Huddersfield</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 22/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75201&amp;bpg=">Plessey Festive Frolics</a></td>
				<td>Local</td>
				<td><a href="http://www.newcastleorienteering.org.uk" target="_blank">NATO</a></td>
				<td>NEOA</td>
				<td>Plessey Woods</td>
				<td>Bedlington</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 26/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75217&amp;bpg=">LOK Boxing Day Score Event</a></td>
				<td>Local</td>
				<td><a href="http://www.londonorienteering.co.uk" target="_blank">LOK</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ289968&amp;z=126">Trent Park</a></td>
				<td>Cockfosters</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ289968&amp;z=126">TQ289968</a></td></tr><tr style="background-color: #FFF"><td>Thu 26/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75926&amp;bpg=">WIM Boxing Day Canter</a></td>
				<td>Local</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td>Moors Valley Country Park </td>
				<td>Verwood</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 28/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75229&amp;bpg=">ELO Local Events in Edinburgh and the Lothians</a></td>
				<td>Local</td>
				<td><a href="http://www.elo.org.uk" target="_blank">ELO</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT649787&amp;z=126">John Muir Country Park</a></td>
				<td>Dunbar</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT649787&amp;z=126">NT649787</a></td></tr><tr style="background-color: #FFF"><td>Sun 29/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=73748&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td></td>
				<td>York</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 29/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75202&amp;bpg=">Bolam Festive Frolics</a></td>
				<td>Local</td>
				<td><a href="http://www.newcastleorienteering.org.uk" target="_blank">NATO</a></td>
				<td>NEOA</td>
				<td>Bolam Woods</td>
				<td>Ponteland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 29/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=75565&amp;bpg=">SO Xmas Score</a></td>
				<td>Local</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>tbc</td>
				<td>Crawley</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 29/12/19</td>
				<td><a href="index.php?pg=event&amp;amp;event=76282&amp;bpg=">OD Christmas Relays - Rough Close</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP264780&amp;z=126">Rough Close Scout Camp</a></td>
				<td>Coventry</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP264780&amp;z=126">SP264780</a></td></tr><tr style="background-color: #FFF"><td>Wed 01/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74850&amp;bpg=">New Year's Day Score</a></td>
				<td>Local</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td>Martin Down</td>
				<td>Salisbury</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 01/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75498&amp;bpg=">East Midlands Urban League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK287539&amp;z=126">Wirksworth</a></td>
				<td>Wirksworth</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK287539&amp;z=126">SK287539</a></td></tr><tr style="background-color: #FFF"><td>Wed 01/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76357&amp;bpg=">SOS New Year Novelty</a></td>
				<td>Local</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Colchester</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 05/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74864&amp;bpg=">East Midlands League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>Strawberry Hill</td>
				<td>Mansfield</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 05/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75632&amp;bpg=">Regional Middle Distance Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td>Bramley Fall</td>
				<td>Leeds</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 05/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75740&amp;bpg=">Belhus Woods event</a></td>
				<td>Regional</td>
				<td><a href="http://orienteering-havoc.co.uk" target="_blank">HAVOC</a></td>
				<td>EAOA</td>
				<td>Belhus Woods Country Park</td>
				<td>South Ockenden</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 05/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76244&amp;bpg=">STAG Score 1</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS749760&amp;z=126">Cumbernauld Community Park</a></td>
				<td>Glasgow</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS749760&amp;z=126">NS749760</a></td></tr><tr style="background-color: #EEE"><td>Sat 11/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76093&amp;bpg=">Western Night League</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST415722&amp;z=126">Clevedon Court Estate</a></td>
				<td>Clevedon</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST415722&amp;z=126">ST415722</a></td></tr><tr style="background-color: #FFF"><td>Sat 11/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76273&amp;bpg=">OD Saturday Morning Event - Daventry Country Park</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP575629&amp;z=126">Daventry Country Park</a></td>
				<td>Daventry</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP575629&amp;z=126">SP575629</a></td></tr><tr style="background-color: #EEE"><td>Sun 12/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75468&amp;bpg=">Kings Forest - North Stow</a></td>
				<td>Regional</td>
				<td><a href="http://www.suffoc.co.uk" target="_blank">SUFFOC</a></td>
				<td>EAOA</td>
				<td>North Stow</td>
				<td>Bury St Edmunds</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 12/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75899&amp;bpg=">NWO Galoppen</a></td>
				<td>Regional</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU153663&amp;z=126">West Woods</a></td>
				<td>Marlborough</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU153663&amp;z=126">SU153663</a></td></tr><tr style="background-color: #EEE"><td>Sun 12/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76087&amp;bpg=">BOK Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST415722&amp;z=126">Clevedon Court Estate</a></td>
				<td>Clevedon</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST415722&amp;z=126">ST415722</a></td></tr><tr style="background-color: #FFF"><td>Sun 12/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76137&amp;bpg=">Forest League 5</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td>Truro</td>
				<td>Truro</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 12/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76144&amp;bpg=">East Midlands League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td>Martinshaw Woods</td>
				<td>Leicester</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Mon 13/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75927&amp;bpg=">WIM/WSX Monthly Evening event - Fordingbridge</a></td>
				<td>Local</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td>Fordingbridge</td>
				<td>Fordingbridge, Hants</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 18/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75375&amp;bpg=">NGOC 50th Anniversary</a></td>
				<td>National</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td></td>
				<td>tba</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 18/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75636&amp;bpg=">YHOA Night League</a></td>
				<td>Regional</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td></td>
				<td>York</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 19/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=72463&amp;bpg=">DFOK SE League Event</a></td>
				<td>National</td>
				<td><a href="http://www.dfok.co.uk" target="_blank">DFOK</a></td>
				<td>SEOA</td>
				<td>Cobham and West Kent Downs</td>
				<td>Gravesend</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 19/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75376&amp;bpg=">NGOC 50th Anniversary incl Galoppen</a></td>
				<td>National</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td></td>
				<td>tba</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 19/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75887&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td>Ramsley</td>
				<td>Sheffield</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 19/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76245&amp;bpg=">STAG Score 2</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS609579&amp;z=126">Cathkin Braes Country Park</a></td>
				<td>Glasgow</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS609579&amp;z=126">NS609579</a></td></tr><tr style="background-color: #EEE"><td>Sun 19/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76278&amp;bpg=">OD WML Event - Hartshill Hayes (TBC)</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td>Hartshill Hayes Country Park</td>
				<td>Nuneaton</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 19/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76299&amp;bpg=">NOR Regional event</a></td>
				<td>Regional</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Norfolk</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 23/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75757&amp;bpg=">Kent Night Cup</a></td>
				<td>Local</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td>Epsom Downs</td>
				<td>Epsom</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 25/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75635&amp;bpg=">YHOA Night League</a></td>
				<td>Regional</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td>Middleton Woods</td>
				<td>Ilkley</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 26/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73330&amp;bpg=">Southern Championships (UKOL)</a></td>
				<td>Major</td>
				<td><a href="http://www.bko.org.uk" target="_blank">BKO</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU851520&amp;z=126">Long Valley North</a></td>
				<td>South Central</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU851520&amp;z=126">SU851520</a></td></tr><tr style="background-color: #FFF"><td>Sun 26/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75706&amp;bpg=">QOFL4</a></td>
				<td>Local</td>
				<td><a href="http://www.quantockorienteers.co.uk" target="_blank">QO</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Taunton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 26/01/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76052&amp;bpg=">WML Wrekin Event </a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td>To be confirmed </td>
				<td>Shropshire </td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 01/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76267&amp;bpg=">Northern Night Champs (TBC)</a></td>
				<td>Regional</td>
				<td><a href="http://www.newcastleorienteering.org.uk" target="_blank">NATO</a></td>
				<td>NEOA</td>
				<td>Jesmond Dene</td>
				<td>Newcastle</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 02/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74082&amp;bpg=">GO SE League Event</a></td>
				<td>National</td>
				<td><a href="http://www.guildfordorienteers.co.uk" target="_blank">GO</a></td>
				<td>SEOA</td>
				<td>Woolbeding</td>
				<td>tbc</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 02/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74244&amp;bpg="> Middle Distance Bickerton</a></td>
				<td>National</td>
				<td><a href="http://www.deeside-orienteering-club.org.uk" target="_blank">DEE</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ509587&amp;z=126">Bickerton Hill</a></td>
				<td>Tarporley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ509587&amp;z=126">SJ509587</a></td></tr><tr style="background-color: #EEE"><td>Sun 02/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75713&amp;bpg=">ESOC Sprint-O </a></td>
				<td>Regional</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td></td>
				<td>Edinburgh</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 02/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76138&amp;bpg=">Forest League 6</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SX264723&amp;z=126">Craddock Moor</a></td>
				<td>Liskeard</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SX264723&amp;z=126">SX264723</a></td></tr><tr style="background-color: #EEE"><td>Sun 02/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76156&amp;bpg=">East Midlands League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.logonline.org.uk" target="_blank">LOG</a></td>
				<td>EMOA</td>
				<td>Harlaxton</td>
				<td>Grantham</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 02/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76358&amp;bpg=">SOS Writtle Forest EA League and ESSOL</a></td>
				<td>Regional</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td>Writtle Forest</td>
				<td>Chelmsford</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 02/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76414&amp;bpg=">BOK Regional and SW League event</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST470565&amp;z=126">Rowberrow and Dolebury Warren</a></td>
				<td>Shipham</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST470565&amp;z=126">ST470565</a></td></tr><tr style="background-color: #FFF"><td>Sun 09/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73329&amp;bpg=">Midlands Championships (UKOL)</a></td>
				<td>Major</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK325531&amp;z=126">Shining Cliff</a></td>
				<td>Matlock</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK325531&amp;z=126">SK325531</a></td></tr><tr style="background-color: #EEE"><td>Sun 09/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75933&amp;bpg=">NWO Four Colour Event</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU281618&amp;z=126">Copse Wood</a></td>
				<td>Burbage</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU281618&amp;z=126">SU281618</a></td></tr><tr style="background-color: #FFF"><td>Sun 09/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76246&amp;bpg=">STAG SoSOL</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS823559&amp;z=126">Greenhead Moss</a></td>
				<td>Motherwell</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS823559&amp;z=126">NS823559</a></td></tr><tr style="background-color: #EEE"><td>Sat 15/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74847&amp;bpg=">Sarum saturday &amp; Wessex NightO</a></td>
				<td>Local</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td>Vernditch</td>
				<td>Salisbury</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 15/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76274&amp;bpg=">OD Saturday Morning Event - Everdon Stubbs</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP606562&amp;z=126">Everdon Stubbs Woodlands</a></td>
				<td>Daventry</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP606562&amp;z=126">SP606562</a></td></tr><tr style="background-color: #EEE"><td>Sat 15/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76409&amp;bpg=">BKO Winter Saturday Series (Star Posts)</a></td>
				<td>Local</td>
				<td><a href="http://www.bko.org.uk" target="_blank">BKO</a></td>
				<td>SCOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU875659&amp;z=126">Star Posts</a></td>
				<td>Bracknell</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SU875659&amp;z=126">SU875659</a></td></tr><tr style="background-color: #FFF"><td>Sun 16/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74190&amp;bpg=">MV SE League Event</a></td>
				<td>National</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=RH17 6NJ&amp;z=126">Balcombe</a></td>
				<td>Crawley</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=RH17 6NJ&amp;z=126"></a></td></tr><tr style="background-color: #EEE"><td>Sun 16/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75365&amp;bpg=">Croxton Heath East Anglian League</a></td>
				<td>Regional</td>
				<td><a href="http://www.waoc.org.uk" target="_blank">WAOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IP24 1LU&amp;z=126">Croxton Heath</a></td>
				<td>Thetford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=IP24 1LU&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 16/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75634&amp;bpg=">YHOA Superleague</a></td>
				<td>Regional</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td>Harden Moor</td>
				<td>Keighley</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 16/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75716&amp;bpg=">CompassPoint Scottish Orienteering League </a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Scotland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 16/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75898&amp;bpg=">WIM Regional</a></td>
				<td>Regional</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td>New Forest</td>
				<td>Ringwood</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 16/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76145&amp;bpg=">East Midlands League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td>Feanedock &amp; Hanging Hill</td>
				<td>Ashby</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 22/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=72487&amp;bpg=">British Night Orienteering Championships (TVOC)</a></td>
				<td>Major</td>
				<td><a href="http://www.tvoc.org.uk" target="_blank">TVOC</a></td>
				<td>SCOA</td>
				<td>Hambleden</td>
				<td>Henley-on-Thames</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 23/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=72488&amp;bpg=">TVOC Chiltern Challenge National Event</a></td>
				<td>National</td>
				<td><a href="http://www.tvoc.org.uk" target="_blank">TVOC</a></td>
				<td>SCOA</td>
				<td>Hambleden</td>
				<td>Henley-on-Thames</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 23/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75707&amp;bpg=">QOFL 5</a></td>
				<td>Local</td>
				<td><a href="http://www.quantockorienteers.co.uk" target="_blank">QO</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Taunton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 23/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75715&amp;bpg=">ESOC SoSOL</a></td>
				<td>Regional</td>
				<td><a href="http://www.esoc.org.uk/home" target="_blank">ESOC</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT215595&amp;z=126">Penicuik Estate</a></td>
				<td>Penicuik</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NT215595&amp;z=126">NT215595</a></td></tr><tr style="background-color: #FFF"><td>Sun 23/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76148&amp;bpg=">East Midlands League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>Byron's Walk</td>
				<td>Mansfield</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 23/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76300&amp;bpg=">NOR Regional event</a></td>
				<td>Regional</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Norfolk</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 29/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=71556&amp;bpg=">Welsh Middle Distance Championships &amp; 2020 Welsh League race</a></td>
				<td>Regional</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td>Merthyr Common</td>
				<td>Brynmawr</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 29/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76088&amp;bpg=">BOK Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST673735&amp;z=126">Warmley Forest Park</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST673735&amp;z=126">ST673735</a></td></tr><tr style="background-color: #FFF"><td>Sat 29/02/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76094&amp;bpg=">Western Night League</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST673735&amp;z=126">Warmley Forest Park</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST673735&amp;z=126">ST673735</a></td></tr><tr style="background-color: #EEE"><td>Sun 01/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=71555&amp;bpg=">2020 Welsh Orienteering Championships </a></td>
				<td>National</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td>Merthyr Common</td>
				<td>Trefil</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 01/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74188&amp;bpg=">HH Ace of Herts SE League Event &amp; Interland</a></td>
				<td>National</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td>Burnham Beeches/Egypt Woods</td>
				<td>Slough</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 01/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74405&amp;bpg=">National Event &amp; YHOA Superleague</a></td>
				<td>National</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td>Burbage</td>
				<td>Sheffield</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 01/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75469&amp;bpg=">Ickworth Park</a></td>
				<td>Regional</td>
				<td><a href="http://www.suffoc.co.uk" target="_blank">SUFFOC</a></td>
				<td>EAOA</td>
				<td>Ickworth Park</td>
				<td>Bury St Edmunds</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 01/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75687&amp;bpg=">Wessex Galoppen</a></td>
				<td>Regional</td>
				<td><a href="http://www.wessex-oc.org" target="_blank">WSX</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Poole</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 08/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74076&amp;bpg=">Sarum Saunter</a></td>
				<td>National</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td>Great Ridge West</td>
				<td>Salisbury</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 08/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75366&amp;bpg=">Rowney Warren YBT heat</a></td>
				<td>Regional</td>
				<td><a href="http://www.waoc.org.uk" target="_blank">WAOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SG17 5QB&amp;z=126">Rowney Warren</a></td>
				<td>Bedford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SG17 5QB&amp;z=126"></a></td></tr><tr style="background-color: #FFF"><td>Sun 08/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75457&amp;bpg=">CHIG SWELL event</a></td>
				<td>Regional</td>
				<td><a href="http://www.chig.org.uk" target="_blank">CHIG</a></td>
				<td>SEOA</td>
				<td>Wormley Woods</td>
				<td>Broxbourne</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 08/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75637&amp;bpg=">YHOA Middle Champs and YHOA Superleague</a></td>
				<td>Regional</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td></td>
				<td>North York Moors</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 08/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76139&amp;bpg=">Forest League 7</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SW747415&amp;z=126">Polcice</a></td>
				<td>Camborne</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SW747415&amp;z=126">SW747415</a></td></tr><tr style="background-color: #EEE"><td>Sun 08/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76151&amp;bpg=">East Midlands League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td>Linacre</td>
				<td>Chesterfield</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 08/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76165&amp;bpg=">Cumbrian Galoppen - High Rigg</a></td>
				<td>Regional</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>High Rigg</td>
				<td>Keswick</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 14/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76275&amp;bpg=">OD Saturday Morning Event - Ryton Pools</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP370724&amp;z=126">Ryton Pools</a></td>
				<td>Coventry</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP370724&amp;z=126">SP370724</a></td></tr><tr style="background-color: #FFF"><td>Sun 15/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73346&amp;bpg=">CompassSport Cup Heat</a></td>
				<td>National</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td>Forest of Dean</td>
				<td>Gloucester</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 15/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74344&amp;bpg=">CompassSport Cup Heat</a></td>
				<td>National</td>
				<td></td>
				<td>SCOA</td>
				<td></td>
				<td>South Central</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 15/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74345&amp;bpg=">CompassSport Cup Heat</a></td>
				<td>National</td>
				<td><a href="http://www.londonorienteering.co.uk" target="_blank">LOK</a></td>
				<td>SEOA</td>
				<td>Hampstead Heath</td>
				<td>Hampstead Heath</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 15/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74346&amp;bpg=">CompassSport Cup Heat</a></td>
				<td>National</td>
				<td><a href="http://www.harlequins.org.uk" target="_blank">HOC</a></td>
				<td>WMOA</td>
				<td></td>
				<td>West Midlands</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 15/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74347&amp;bpg=">CompassSport Cup Heat</a></td>
				<td>National</td>
				<td></td>
				<td>EAOA</td>
				<td>Aspley Heath</td>
				<td>Milton Keynes</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 15/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74348&amp;bpg=">CompassSport Cup Heat</a></td>
				<td>National</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td></td>
				<td>Lake District</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 15/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74349&amp;bpg=">CompassSport Cup Heat</a></td>
				<td>National</td>
				<td><a href="http://www.eastpennineoc.org.uk" target="_blank">EPOC</a></td>
				<td>YHOA</td>
				<td>Ogden Water</td>
				<td>Halifax</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 15/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74350&amp;bpg=">CompassSport Cup Heat</a></td>
				<td>National</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td></td>
				<td>Highland Perthshire</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 21/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73322&amp;bpg=">British Orienteering Championships (UKOL)</a></td>
				<td>Major</td>
				<td></td>
				<td>SEOA</td>
				<td>Lynchmere</td>
				<td>Haslemere</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 21/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76405&amp;bpg=">British Trail Orienteering Championships</a></td>
				<td>National</td>
				<td></td>
				<td>SEOA</td>
				<td>tba</td>
				<td>tba</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 22/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73323&amp;bpg=">British Relay Championships</a></td>
				<td>Major</td>
				<td></td>
				<td>SEOA</td>
				<td>tba</td>
				<td>South East</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 28/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74112&amp;bpg=">BUCS - British Universities &amp; Colleges Sport Championships</a></td>
				<td>National</td>
				<td><a href="http://www.cuoc.org.uk" target="_blank">CUOC</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Cambridge</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 28/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76064&amp;bpg=">NWO Four Colour Event</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Marlborough</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 29/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74113&amp;bpg=">BUCS - British Universities &amp; Colleges Sport Championships</a></td>
				<td>National</td>
				<td><a href="http://www.cuoc.org.uk" target="_blank">CUOC</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Cambridge</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 29/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75161&amp;bpg=">QO Galoppen</a></td>
				<td>Regional</td>
				<td><a href="http://www.quantockorienteers.co.uk" target="_blank">QO</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Taunton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 29/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75579&amp;bpg=">SAX South East League Event</a></td>
				<td>National</td>
				<td><a href="http://www.saxons-oc.org" target="_blank">SAX</a></td>
				<td>SEOA</td>
				<td></td>
				<td>South East</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 29/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75672&amp;bpg=">YHOA Superleague</a></td>
				<td>Regional</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td>Guisecliff</td>
				<td>Pateley Bridge</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 29/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75717&amp;bpg=">CompassPoint Scottish Orienteering League</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Scotland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 29/03/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76146&amp;bpg=">East Midlands League 2020 &amp; YBT Heat</a></td>
				<td>Regional</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td>Outwoods</td>
				<td>Loughborough</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 04/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75600&amp;bpg=">To be Confirmed</a></td>
				<td>Local</td>
				<td><a href="http://southampton-orienteers.org.uk" target="_blank">SOC</a></td>
				<td>SCOA</td>
				<td></td>
				<td>Southampton</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 05/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75601&amp;bpg=">To be Confirmed (copy)</a></td>
				<td>Local</td>
				<td><a href="http://southampton-orienteers.org.uk" target="_blank">SOC</a></td>
				<td>SCOA</td>
				<td></td>
				<td>Southampton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 05/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75723&amp;bpg=">CompassPoint Scottish Orienteering League</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Scotland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 05/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75831&amp;bpg=">Woodside Urban </a></td>
				<td>Local</td>
				<td><a href="http://www.wrekinorienteers.co.uk" target="_blank">WRE</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ683042&amp;z=126">Woodside</a></td>
				<td>Telford </td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ683042&amp;z=126">SJ683042</a></td></tr><tr style="background-color: #EEE"><td>Sun 05/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76089&amp;bpg=">BOK Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST558542&amp;z=126">East Harptree Woods</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST558542&amp;z=126">ST558542</a></td></tr><tr style="background-color: #FFF"><td>Sun 05/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76157&amp;bpg=">East Midlands Urban League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>Arnot Hill Park</td>
				<td>Nottingham</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 05/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76301&amp;bpg=">NOR Regional event</a></td>
				<td>Regional</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Norfolk</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Fri 10/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73318&amp;bpg=">Jan Kjellström Orienteering Festival - Sprint (UKOL &amp; WRE)</a></td>
				<td>Major</td>
				<td></td>
				<td>NEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ455187&amp;z=126">Stockton Riverside</a></td>
				<td>Stockton</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ455187&amp;z=126">NZ455187</a></td></tr><tr style="background-color: #EEE"><td>Sat 11/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73319&amp;bpg=">Jan Kjellström Orienteering Festival - Middle (UKOL &amp; WRE)</a></td>
				<td>Major</td>
				<td></td>
				<td>NEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ887022&amp;z=126">Sneaton Forest West</a></td>
				<td>Whitby</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ887022&amp;z=126">NZ887022</a></td></tr><tr style="background-color: #FFF"><td>Sun 12/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73320&amp;bpg=">Jan Kjellström Orienteering Festival - Long (UKOL &amp; WRE)</a></td>
				<td>Major</td>
				<td></td>
				<td>NEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE812927&amp;z=126">Pickering Forest</a></td>
				<td>Pickering</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SE812927&amp;z=126">SE812927</a></td></tr><tr style="background-color: #EEE"><td>Mon 13/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73321&amp;bpg=">Jan Kjellström Orienteering Festival - Relays</a></td>
				<td>Major</td>
				<td></td>
				<td>NEOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ846091&amp;z=126">Hutton Mulgrave and Skelder</a></td>
				<td>Whitby</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NZ846091&amp;z=126">NZ846091</a></td></tr><tr style="background-color: #FFF"><td>Sat 18/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76276&amp;bpg=">OD Saturday Morning Event - Brueton Park</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP162790&amp;z=126">Brueton Park</a></td>
				<td>Solihull</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP162790&amp;z=126">SP162790</a></td></tr><tr style="background-color: #EEE"><td>Sun 19/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74284&amp;bpg=">East Anglian Championships</a></td>
				<td>National</td>
				<td><a href="http://orienteering-havoc.co.uk" target="_blank">HAVOC</a></td>
				<td>EAOA</td>
				<td>Epping SW</td>
				<td>Epping</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 19/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75673&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>Sheffield</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 19/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75782&amp;bpg=">TVOC Regional Event </a></td>
				<td>Regional</td>
				<td><a href="http://www.tvoc.org.uk" target="_blank">TVOC</a></td>
				<td>SCOA</td>
				<td>TBC</td>
				<td>High Wycombe </td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 19/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76140&amp;bpg=">Forest League 8 &amp; Galoppen</a></td>
				<td>Local</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SW983692&amp;z=126">Hustyn</a></td>
				<td>Wadebridge</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SW983692&amp;z=126">SW983692</a></td></tr><tr style="background-color: #EEE"><td>Sat 25/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74259&amp;bpg=">Spring in the Lakes Middle distance event</a></td>
				<td>National</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td>Blakeholme</td>
				<td>Kendal</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 26/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74387&amp;bpg=">Spring in Lakes</a></td>
				<td>National</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td>Ulpha Park TBC</td>
				<td>TBC</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 26/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75639&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>East Riding</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 26/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75708&amp;bpg=">QOFL 6</a></td>
				<td>Local</td>
				<td><a href="http://www.quantockorienteers.co.uk" target="_blank">QO</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Taunton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 26/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76191&amp;bpg=">Amesbury Urban?? </a></td>
				<td>Local</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td>Amesbury South</td>
				<td>Amesbury</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 26/04/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76359&amp;bpg=">SOS Danbury Park Colour Coded and ESSOL</a></td>
				<td>Regional</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td>Danbury</td>
				<td>Danbury</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 02/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=72347&amp;bpg=">Tio Mila 2-3 May</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Sweden</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 02/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75679&amp;bpg=">Event in conjunction with BOK Trot</a></td>
				<td>National</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO613118&amp;z=126">New Beechenhusrt</a></td>
				<td>Cinderford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO613118&amp;z=126">SO613118</a></td></tr><tr style="background-color: #EEE"><td>Sun 03/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75304&amp;bpg=">Mike Nelson BOK Trot</a></td>
				<td>National</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO620121&amp;z=126">Cannop Ponds (N&amp;S)</a></td>
				<td>Coleford</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO620121&amp;z=126">SO620121</a></td></tr><tr style="background-color: #FFF"><td>Sun 03/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75640&amp;bpg=">Regional Event and Yvette Baker Trophy Heat</a></td>
				<td>Regional</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td>Hookstone Woods</td>
				<td>Harrogate</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 03/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75718&amp;bpg=">CompassPoint Scottish Orienteering League</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Scotland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 03/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76302&amp;bpg=">NOR Regional event </a></td>
				<td>Regional</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Norfolk</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 09/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73324&amp;bpg=">British Middle Distance Championships (UKOL)</a></td>
				<td>Major</td>
				<td><a href="http://lakeland-orienteering.org.uk" target="_blank">LOC</a></td>
				<td>NWOA</td>
				<td>Summerhouse Knott</td>
				<td>Newby Bridge</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 10/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73325&amp;bpg=">Lake District Championship Weekend – Northern Chapionships</a></td>
				<td>Major</td>
				<td><a href="http://www.mdoc.org.uk" target="_blank">MDOC</a></td>
				<td>NWOA</td>
				<td>High Dam</td>
				<td>Newby Bridge</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 10/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75750&amp;bpg=">Simon Peck Summer Series 1 - Haughley Park</a></td>
				<td>Local</td>
				<td><a href="http://www.suffoc.co.uk" target="_blank">SUFFOC</a></td>
				<td>EAOA</td>
				<td>Haughley Park</td>
				<td>Stowmarket</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 16/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75548&amp;bpg=">SO &quot;Sunny Sussex&quot; weekend (1 of 3) Middle Distance</a></td>
				<td>Regional</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>Abbots Forest</td>
				<td>Hailsham</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 16/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76262&amp;bpg=">Harwich Urban</a></td>
				<td>Regional</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TM259315&amp;z=126">Harwich</a></td>
				<td>Harwich</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TM259315&amp;z=126">TM259315</a></td></tr><tr style="background-color: #FFF"><td>Sun 17/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74530&amp;bpg=">SO &quot;Sunny Sussex&quot; weekend (3 of 3) SE League Event</a></td>
				<td>National</td>
				<td><a href="http://www.southdowns-orienteers.org.uk" target="_blank">SO</a></td>
				<td>SEOA</td>
				<td>Friston Forest</td>
				<td>Eastbourne</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 17/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74827&amp;bpg=">Tenby National Urban Race</a></td>
				<td>National</td>
				<td><a href="http://www.baoc.info/" target="_blank">BAOC</a></td>
				<td>WOA</td>
				<td>Tenby</td>
				<td>Tenby </td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 17/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75367&amp;bpg=">North Cambridge Urban</a></td>
				<td>National</td>
				<td><a href="http://www.waoc.org.uk" target="_blank">WAOC</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Cambridge</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 17/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75641&amp;bpg=">Regional Event and YHOA Schools Championships</a></td>
				<td>Regional</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td>Middleton Park</td>
				<td>Leeds</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 17/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76090&amp;bpg=">BOK Local Event</a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST433593&amp;z=126">Sandford and Lyncombe Hill</a></td>
				<td>Churchill</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST433593&amp;z=126">ST433593</a></td></tr><tr style="background-color: #EEE"><td>Sun 17/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76152&amp;bpg=">East Midlands League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td>Longstone Moor</td>
				<td>Bakewell</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 17/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76166&amp;bpg=">Cumbrian Galoppen - Dalegarth</a></td>
				<td>Regional</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Dalegarth, Eskdale</td>
				<td>Egremont</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 23/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73331&amp;bpg=">Scottish Championships - Individual</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Scotland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 23/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76291&amp;bpg=">Tamar Triple Day 1 - Urban</a></td>
				<td>National</td>
				<td><a href="http://www.devonorienteering.co.uk" target="_blank">DEVON</a></td>
				<td>SWOA</td>
				<td>Tavistock</td>
				<td>Tavistock</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 24/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73332&amp;bpg=">Scottish Championships Relays</a></td>
				<td>Regional</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Scotland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 24/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75638&amp;bpg=">YHOA Urban League</a></td>
				<td>Regional</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td>Jennyfields</td>
				<td>Harrogate</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 24/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76142&amp;bpg=">Tamar Triple Day 2</a></td>
				<td>National</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td>Davidstow Moor South</td>
				<td>Bodmin</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 24/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76307&amp;bpg=">NOR summer series</a></td>
				<td>Local</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td></td>
				<td></td></tr><tr style="background-color: #EEE"><td>Mon 25/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75642&amp;bpg=">YHOA Urban League/York City Race</a></td>
				<td>Regional</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td></td>
				<td>York</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Mon 25/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76143&amp;bpg=">Tamar Triple Day 3</a></td>
				<td>National</td>
				<td><a href="http://www.cornwallorienteering.org.uk" target="_blank">KERNO</a></td>
				<td>SWOA</td>
				<td>Hardhead Downs</td>
				<td>Bodmin</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 31/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75648&amp;bpg=">YHOA Championships &amp; YHOA Superleague</a></td>
				<td>Regional</td>
				<td><a href="http://www.eastpennineoc.org.uk" target="_blank">EPOC</a></td>
				<td>YHOA</td>
				<td></td>
				<td>East Pennines</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 31/05/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76158&amp;bpg=">East Midlands Urban League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td>Ashby</td>
				<td>Ashby</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Fri 05/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74226&amp;bpg=">World Cup Period 5-7 June</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Sweden</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Fri 05/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75024&amp;bpg=">STAG 1st Glasgow Giant Weekend - Day 1 - Race 1</a></td>
				<td>Regional</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS567663&amp;z=126">Kelvingrove Park</a></td>
				<td>Glasgow</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS567663&amp;z=126">NS567663</a></td></tr><tr style="background-color: #EEE"><td>Sat 06/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75025&amp;bpg=">STAG 1st Glasgow Giant Weekend - Day 2- Race 2</a></td>
				<td>Regional</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS555621&amp;z=126">Pollok Country Park</a></td>
				<td>Glasgow</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=NS555621&amp;z=126">NS555621</a></td></tr><tr style="background-color: #FFF"><td>Sun 07/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75026&amp;bpg=">STAG 1st Glasgow Giant Weekend - Day 3 - Race 3</a></td>
				<td>Regional</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>Glasgow City Centre</td>
				<td>Glasgow</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 07/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75471&amp;bpg=">Simon Peck Summer Series 2</a></td>
				<td>Local</td>
				<td><a href="http://www.suffoc.co.uk" target="_blank">SUFFOC</a></td>
				<td>EAOA</td>
				<td>Bury St Edmunds</td>
				<td>Bury St Edmunds</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 07/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75633&amp;bpg=">YHOA Urban League</a></td>
				<td>Regional</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td>Gleadless</td>
				<td>Sheffield</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 07/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76099&amp;bpg=">BOK Regional Urban Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST397708&amp;z=126">Clevedon</a></td>
				<td>Clevedon</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST397708&amp;z=126">ST397708</a></td></tr><tr style="background-color: #FFF"><td>Sun 07/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76277&amp;bpg=">WMUL - OD (TBC)</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td></td>
				<td>tbc</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 13/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=72348&amp;bpg=">Jukola Relay 13-14 June</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Finland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 13/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75643&amp;bpg=">YHOA Urban League</a></td>
				<td>Regional</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>East Riding</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 14/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75644&amp;bpg=">YHOA Urban League</a></td>
				<td>Regional</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>East Riding</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 14/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75719&amp;bpg=">CompassPoint Scottish Orienteering League</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Scotland</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 14/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76159&amp;bpg=">East Midlands Urban League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td>Barrow on Soar</td>
				<td>Loughborough</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 14/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76360&amp;bpg=">SOS Wivenhoe Woods Colour Coded and ESSOL</a></td>
				<td>Regional</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Wivenhoe</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Fri 19/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75235&amp;bpg=">European Youth Orienteering Championships 19-22 June</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Hungary</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 20/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73326&amp;bpg=">British Sprint Championships (UKOL)</a></td>
				<td>Major</td>
				<td></td>
				<td>NWOA</td>
				<td>Skelmersdale</td>
				<td>Skelmersdale</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 20/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76308&amp;bpg=">NOR summer series</a></td>
				<td>Local</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td></td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 21/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73327&amp;bpg=">British Mixed Sprint Relays</a></td>
				<td>National</td>
				<td></td>
				<td>NWOA</td>
				<td>Skelmersdale</td>
				<td>Skelmersdale</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 28/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73675&amp;bpg=">Junior World Orienteering Championships 28 Jun - 5 Jul</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Turkey</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 28/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=74902&amp;bpg=">Harvester Relays tbc</a></td>
				<td>National</td>
				<td><a href="http://www.fvo.org.uk" target="_blank">FVO</a></td>
				<td>SOA</td>
				<td></td>
				<td>Forth Valley Scotland</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 28/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75674&amp;bpg=">EBOR Club Championships</a></td>
				<td>Regional</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td></td>
				<td>North Yorkshire</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 28/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76091&amp;bpg=">Adams-Avery &amp; BOK Junior Relays </a></td>
				<td>Local</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST634766&amp;z=126">Oldbury Court &amp; Frome Gorge</a></td>
				<td>Bristol</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST634766&amp;z=126">ST634766</a></td></tr><tr style="background-color: #EEE"><td>Sun 28/06/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76160&amp;bpg=">East Midlands Urban League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td>Belper</td>
				<td>Belper</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 04/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75658&amp;bpg=">Fat Rascal Weekend - YHOA Urban League</a></td>
				<td>Regional</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td></td>
				<td>Leeds</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 05/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73342&amp;bpg=">Yvette Baker Trophy Final</a></td>
				<td>National</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST856897&amp;z=126">Westonbirt Arboretum</a></td>
				<td>Tetbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=ST856897&amp;z=126">ST856897</a></td></tr><tr style="background-color: #FFF"><td>Sun 05/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75645&amp;bpg=">Fat Rascal Weekend - YHOA Urban League</a></td>
				<td>Regional</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td>Guiseley</td>
				<td>Guiseley</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 05/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76081&amp;bpg=">Birmingham Urban (Provisional)</a></td>
				<td>Local</td>
				<td><a href="http://www.harlequins.org.uk" target="_blank">HOC</a></td>
				<td>WMOA</td>
				<td></td>
				<td>Birmingham</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 05/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76309&amp;bpg=">NOR summer series</a></td>
				<td>Local</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Norfolk</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Tue 07/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=72340&amp;bpg=">World Orienteering Championships - Sprint 7-11 Jul (World Cup)</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Denmark</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 11/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76417&amp;bpg=">SN Urban Event</a></td>
				<td>National</td>
				<td><a href="https://www.southernnavigators.com/" target="_blank">SN</a></td>
				<td>SEOA</td>
				<td></td>
				<td>South East</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 12/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75472&amp;bpg=">Simon Peck Summer Series 3</a></td>
				<td>Local</td>
				<td><a href="http://www.suffoc.co.uk" target="_blank">SUFFOC</a></td>
				<td>EAOA</td>
				<td>Royal Hospital School</td>
				<td>Ipswich</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 12/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75646&amp;bpg=">YHOA Urban League</a></td>
				<td>Regional</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>Sheffield</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 12/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76167&amp;bpg=">Cumbrian Galoppen - Sale Fell</a></td>
				<td>Regional</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Sale Fell</td>
				<td>Cockermouth</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 12/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76279&amp;bpg=">OD WML Event - Burton Dassett (TBC)</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP396519&amp;z=126">Burton Dassett Hills Country Park</a></td>
				<td>Southam</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP396519&amp;z=126">SP396519</a></td></tr><tr style="background-color: #EEE"><td>Sun 19/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73676&amp;bpg=">Oringen 19 - 24 July</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Sweden</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 19/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75647&amp;bpg=">YHOA Urban League</a></td>
				<td>Regional</td>
				<td><a href="http://www.eastpennineoc.org.uk" target="_blank">EPOC</a></td>
				<td>YHOA</td>
				<td></td>
				<td>East Pennines</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 26/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75427&amp;bpg=">Croeso 2020 Day 1</a></td>
				<td>National</td>
				<td><a href="https://www.eryri-orienteering.org/" target="_blank">ERYRI</a></td>
				<td>WOA</td>
				<td>Caen-y-Coed (TBC)</td>
				<td>Betws-y-Coed</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Mon 27/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75758&amp;bpg=">Croeso 2020 Day 2</a></td>
				<td>Regional</td>
				<td><a href="https://www.eryri-orienteering.org/" target="_blank">ERYRI</a></td>
				<td>WOA</td>
				<td>Cnicht (TBC)</td>
				<td>Beddgelert</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Tue 28/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75759&amp;bpg=">Croeso 2020 Day 3 (hosted by DEE)</a></td>
				<td>Regional</td>
				<td><a href="https://www.eryri-orienteering.org/" target="_blank">ERYRI</a></td>
				<td>WOA</td>
				<td>Wepre Park (TBC)</td>
				<td>Queensferry</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Thu 30/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75760&amp;bpg=">Croeso 2020 Day 4</a></td>
				<td>Regional</td>
				<td><a href="https://www.eryri-orienteering.org/" target="_blank">ERYRI</a></td>
				<td>WOA</td>
				<td>Llyn Trawsfynedd (TBC)</td>
				<td>Blaenau Ffestiniog </td>
				<td></td></tr><tr style="background-color: #EEE"><td>Fri 31/07/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75761&amp;bpg=">Croeso 2020 Day 5</a></td>
				<td>Regional</td>
				<td><a href="https://www.eryri-orienteering.org/" target="_blank">ERYRI</a></td>
				<td>WOA</td>
				<td>Llyn Dinas (TBC)</td>
				<td>Beddgelert</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 01/08/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76268&amp;bpg=">Croeso 2020 Day 6</a></td>
				<td>Regional</td>
				<td><a href="https://www.eryri-orienteering.org/" target="_blank">ERYRI</a></td>
				<td>WOA</td>
				<td>Gwrych Castle (TBC)</td>
				<td>North Wales</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Fri 07/08/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73677&amp;bpg=">World Masters Orienteering Championships 7 - 15 Aug</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Slovakia</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 16/08/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76251&amp;bpg=">STAG SOUL</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td></td>
				<td>East Kilbride</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 16/08/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76280&amp;bpg=">OD WMUL - Daventry (TBC)</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td>Daventry</td>
				<td>Daventry</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 16/08/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76406&amp;bpg=">EM Urban League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.logonline.org.uk" target="_blank">LOG</a></td>
				<td>EMOA</td>
				<td>Lincoln City</td>
				<td>Lincoln</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Wed 19/08/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75236&amp;bpg=">European Orienteering Championships 19-23 Aug</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Estonia</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 29/08/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75651&amp;bpg=">White Rose Day 1</a></td>
				<td>National</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td></td>
				<td>North Yorkshire</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 30/08/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75652&amp;bpg=">White Rose Day 2 and YHOA Superleague</a></td>
				<td>National</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td></td>
				<td>North Yorkshire</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 30/08/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76418&amp;bpg=">MV Urban Event</a></td>
				<td>National</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td></td>
				<td>Leatherhead</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Mon 31/08/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75653&amp;bpg=">White Rose Relays</a></td>
				<td>National</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td></td>
				<td>North Yorkshire</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 05/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73335&amp;bpg=">Senior Home Internationals Relays</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Scotland</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 06/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73336&amp;bpg="> CompassPoint Scottish Orienteering League  incorporating Senior Home Internationals Individual</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Scotland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 06/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76153&amp;bpg=">East Midlands League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td>Kedleston Hall</td>
				<td>Derby</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 12/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73757&amp;bpg=">Dales Weekend</a></td>
				<td>National</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td>Conistone South</td>
				<td>Grassington</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 12/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75559&amp;bpg=">SLOW City of London Race</a></td>
				<td>National</td>
				<td><a href="http://slow.org.uk/" target="_blank">SLOW</a></td>
				<td>SEOA</td>
				<td>tbc</td>
				<td>London</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 13/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73343&amp;bpg=">Peter Palmer Junior Team Relays</a></td>
				<td>National</td>
				<td></td>
				<td></td>
				<td></td>
				<td>???</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 13/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73758&amp;bpg=">Dales Weekend &amp; YHOA Superleague</a></td>
				<td>National</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td>Kilnsey South</td>
				<td>Grassington</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 13/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76303&amp;bpg=">NOR regional event</a></td>
				<td>Regional</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Norfolk</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 13/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76382&amp;bpg=">2020 Welsh League Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.swoc.org.uk" target="_blank">SWOC</a></td>
				<td>WOA</td>
				<td>Llangattock</td>
				<td>South Wales</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 13/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76407&amp;bpg=">EM Urban League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.logonline.org.uk" target="_blank">LOG</a></td>
				<td>EMOA</td>
				<td>Woodhall Spa</td>
				<td>Horncastle</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 19/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73337&amp;bpg=">Veteran Home Internationals Individual</a></td>
				<td>National</td>
				<td><a href="https://fermoblog.wordpress.com/" target="_blank">FERMO</a></td>
				<td>NIOA</td>
				<td></td>
				<td>Northern Ireland</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 20/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73338&amp;bpg=">Veteran Home Internationals Relays</a></td>
				<td>National</td>
				<td><a href="https://fermoblog.wordpress.com/" target="_blank">FERMO</a></td>
				<td>NIOA</td>
				<td></td>
				<td>Northern Ireland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 20/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75575&amp;bpg=">SYO National Event &amp; YHOA Superleague</a></td>
				<td>National</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td>Cowms Rocks</td>
				<td>Glossop</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 20/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75741&amp;bpg=">Hornchurch Country Park</a></td>
				<td>Regional</td>
				<td><a href="http://orienteering-havoc.co.uk" target="_blank">HAVOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ536849&amp;z=126">Hornchurch Country Park</a></td>
				<td>Hornchurch</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ536849&amp;z=126">TQ536849</a></td></tr><tr style="background-color: #FFF"><td>Sun 20/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76168&amp;bpg=">Cumbrian Galoppen - Whinlatter</a></td>
				<td>Regional</td>
				<td><a href="http://www.wcoc.co.uk" target="_blank">WCOC</a></td>
				<td>NWOA</td>
				<td>Whinlatter Forest</td>
				<td>Keswick</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Fri 25/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73678&amp;bpg=">World Cup Period 25 - 27 Sept</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>??</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 26/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73340&amp;bpg=">Junior Inter Regional Championships</a></td>
				<td>National</td>
				<td><a href="http://southampton-orienteers.org.uk" target="_blank">SOC</a></td>
				<td>SCOA</td>
				<td></td>
				<td>South Central</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 27/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73341&amp;bpg=">Junior Inter Regional Championships</a></td>
				<td>National</td>
				<td><a href="http://southampton-orienteers.org.uk" target="_blank">SOC</a></td>
				<td>SCOA</td>
				<td></td>
				<td>South Central</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 27/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75654&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td>Plumpton Rocks</td>
				<td>Harrogate</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 27/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75720&amp;bpg=">CompassPoint Scottish Orienteering League</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Scotland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 27/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76018&amp;bpg=">TVOC Urban Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.tvoc.org.uk" target="_blank">TVOC</a></td>
				<td>SCOA</td>
				<td>TBC</td>
				<td>Oxford </td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 27/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76161&amp;bpg=">East Midlands Urban League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>The Meadows</td>
				<td>Nottingham</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 27/09/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76361&amp;bpg=">SOS High Woods Colour Coded and ESSOL</a></td>
				<td>Regional</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Colchester</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 01/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73679&amp;bpg=">World Cup Period 1 - 4 Oct</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>??</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 03/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75237&amp;bpg=">25manna</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Sweden</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 03/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75297&amp;bpg=">October Odyssey day 1</a></td>
				<td>National</td>
				<td><a href="http://www.northern-navigators.org.uk" target="_blank">NN</a></td>
				<td>NEOA</td>
				<td></td>
				<td>??</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 03/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75766&amp;bpg=">Caddihoe Day 1</a></td>
				<td>National</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Fordingbridge</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 04/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75299&amp;bpg=">October Odyssey day 2 &amp; NE Champs</a></td>
				<td>National</td>
				<td><a href="http://www.northern-navigators.org.uk" target="_blank">NN</a></td>
				<td>NEOA</td>
				<td></td>
				<td>??</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 04/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75767&amp;bpg=">Caddihoe Day 2</a></td>
				<td>National</td>
				<td><a href="http://www.wimborne-orienteers.org.uk/" target="_blank">WIM</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Fordingbridge</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 04/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76154&amp;bpg=">East Midlands League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td>Burbage Common</td>
				<td>Hinckley</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 10/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73333&amp;bpg=">Junior Home Internationals Individual</a></td>
				<td>National</td>
				<td></td>
				<td></td>
				<td></td>
				<td>???</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 10/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73344&amp;bpg=">British Schools Score Championships</a></td>
				<td>National</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK432454&amp;z=126">Shipley Park</a></td>
				<td>Ilkeston</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SK432454&amp;z=126">SK432454</a></td></tr><tr style="background-color: #FFF"><td>Sat 10/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73707&amp;bpg=">DEE Urban Week End</a></td>
				<td>National</td>
				<td><a href="http://www.deeside-orienteering-club.org.uk" target="_blank">DEE</a></td>
				<td>NWOA</td>
				<td></td>
				<td>Chester</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 11/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73334&amp;bpg=">Junior Home Internationals Relays</a></td>
				<td>National</td>
				<td></td>
				<td></td>
				<td></td>
				<td>???</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 11/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73708&amp;bpg=">DEE Urban Week End</a></td>
				<td>National</td>
				<td><a href="http://www.deeside-orienteering-club.org.uk" target="_blank">DEE</a></td>
				<td>NWOA</td>
				<td></td>
				<td>Chester</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 11/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75649&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>Sheffield</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 11/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76304&amp;bpg=">NOR regional event</a></td>
				<td>Regional</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Norfolk</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 18/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73328&amp;bpg=">CompassSport Cup Final</a></td>
				<td>Major</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td>Sutton Park</td>
				<td>Sutton Coldfield</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 25/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75655&amp;bpg=">YHOA Urban League</a></td>
				<td>Regional</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>East Riding</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 25/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75721&amp;bpg=">CompassPoint Scottish Orienteering League</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Scotland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 25/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76155&amp;bpg=">East Midlands League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td>Grangewood</td>
				<td>Swadlincote</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 31/10/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73439&amp;bpg=">Salisbury City Race (UKOL)</a></td>
				<td>National</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td></td>
				<td>Salisbury</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 01/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73674&amp;bpg=">November Classic (UKOL)</a></td>
				<td>National</td>
				<td><a href="http://southampton-orienteers.org.uk" target="_blank">SOC</a></td>
				<td>SCOA</td>
				<td></td>
				<td>Southampton</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 01/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75656&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.eastpennineoc.org.uk" target="_blank">EPOC</a></td>
				<td>YHOA</td>
				<td></td>
				<td>East Pennines</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 01/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75742&amp;bpg=">Hadleigh Park event</a></td>
				<td>Regional</td>
				<td><a href="http://orienteering-havoc.co.uk" target="_blank">HAVOC</a></td>
				<td>EAOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ802869&amp;z=126">Hadleigh  Park</a></td>
				<td>Hadleigh, Benfleet, Essex</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TQ802869&amp;z=126">TQ802869</a></td></tr><tr style="background-color: #EEE"><td>Sun 01/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76247&amp;bpg=">STAG SoSOL</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>TBC</td>
				<td>Shotts</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 08/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75657&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td></td>
				<td>York</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 08/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76096&amp;bpg=">BOK Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO512053&amp;z=126">Wye Valley Forests</a></td>
				<td>Chepstow</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SO512053&amp;z=126">SO512053</a></td></tr><tr style="background-color: #FFF"><td>Sun 08/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76149&amp;bpg=">East Midlands League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>Silverhill Wood</td>
				<td>Mansfield</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 08/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76305&amp;bpg=">NOR regional event</a></td>
				<td>Regional</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Norfolk</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 08/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76419&amp;bpg=">SE Championships and SE League</a></td>
				<td>National</td>
				<td><a href="https://www.southernnavigators.com/" target="_blank">SN</a></td>
				<td>SEOA</td>
				<td>Hindhead</td>
				<td>Haslemere</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 15/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=73345&amp;bpg=">British Schools Orienteering Championships</a></td>
				<td>National</td>
				<td><a href="https://www.herts-orienteering.club/" target="_blank">HH</a></td>
				<td>SEOA</td>
				<td></td>
				<td>Hertfordshire</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 15/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75470&amp;bpg=">Tunstall Forest East Anglian League</a></td>
				<td>Regional</td>
				<td><a href="http://www.suffoc.co.uk" target="_blank">SUFFOC</a></td>
				<td>EAOA</td>
				<td>Tunstall Forest</td>
				<td>Woodbridge</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 15/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75659&amp;bpg=">YHOA Urban Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td>Morley</td>
				<td>Morley</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 15/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76363&amp;bpg=">East Midlands League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td>Hardwick Park</td>
				<td>Chesterfield</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 22/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75578&amp;bpg=">SLOW South East League event</a></td>
				<td>National</td>
				<td><a href="http://slow.org.uk/" target="_blank">SLOW</a></td>
				<td>SEOA</td>
				<td>Wimbledon Common</td>
				<td>Wimbledon</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 22/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75650&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>Sheffield</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 22/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75712&amp;bpg=">EM Championships 2020</a></td>
				<td>National</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td>Bradgate, Swithland &amp; The Brand</td>
				<td>Leicester</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 28/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75660&amp;bpg=">YHOA Night League</a></td>
				<td>Regional</td>
				<td><a href="http://www.claro-orienteering.org.uk" target="_blank">CLARO</a></td>
				<td>YHOA</td>
				<td>Conyngham Hall</td>
				<td>Harrogate</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 29/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76150&amp;bpg=">East Midlands League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.noc-uk.org" target="_blank">NOC</a></td>
				<td>EMOA</td>
				<td>Boundary Wood and Haywood Oaks</td>
				<td>Mansfield</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 29/11/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76362&amp;bpg=">SOS Pods Woods Colour Coded and ESSOL</a></td>
				<td>Regional</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Tiptree</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 05/12/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75661&amp;bpg=">YHOA Night League</a></td>
				<td>Regional</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>East Riding</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 06/12/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75458&amp;bpg=">CHIG Mitre SE League Event</a></td>
				<td>National</td>
				<td><a href="http://www.chig.org.uk" target="_blank">CHIG</a></td>
				<td>SEOA</td>
				<td>Epping North</td>
				<td>Epping</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 06/12/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75663&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://halo-orienteering.org.uk" target="_blank">HALO</a></td>
				<td>YHOA</td>
				<td></td>
				<td>East Riding</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 06/12/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76248&amp;bpg=">22nd Glasgow Parks Championships - Race 1 </a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>TBC</td>
				<td>Glasgow</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 06/12/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76249&amp;bpg=">22nd Glasgow Parks Championships - Race 2</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>TBC</td>
				<td>Glasgow</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 06/12/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76250&amp;bpg=">22nd Glasgow Parks Championships - Race 3</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>TBC</td>
				<td>Glasgow</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 06/12/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76281&amp;bpg=">OD WML Event &amp; Club Champs - Itchington Holt (TBC)</a></td>
				<td>Local</td>
				<td><a href="http://www.octavian-droobers.org" target="_blank">OD</a></td>
				<td>WMOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP374588&amp;z=126">Itchington Holt</a></td>
				<td>Harbury</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SP374588&amp;z=126">SP374588</a></td></tr><tr style="background-color: #FFF"><td>Sun 06/12/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76306&amp;bpg=">NOR East Anglian League event</a></td>
				<td>Regional</td>
				<td><a href="http://www.norfolkoc.co.uk" target="_blank">NOR</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Norfolk</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 13/12/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75664&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td>Esholt Woods</td>
				<td>Guiseley</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 13/12/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=76147&amp;bpg=">East Midlands League 2020</a></td>
				<td>Regional</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td>Bagworth Common and Woods</td>
				<td>Leicester</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 19/12/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75662&amp;bpg=">YHOA Night League</a></td>
				<td>Regional</td>
				<td><a href="http://www.eastpennineoc.org.uk" target="_blank">EPOC</a></td>
				<td>YHOA</td>
				<td></td>
				<td>East Pennines</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 20/12/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75665&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.eastpennineoc.org.uk" target="_blank">EPOC</a></td>
				<td>YHOA</td>
				<td></td>
				<td>East Pennines</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 27/12/20</td>
				<td><a href="index.php?pg=event&amp;amp;event=75666&amp;bpg=">Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.eborienteers.org.uk" target="_blank">EBOR</a></td>
				<td>YHOA</td>
				<td></td>
				<td>York</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 30/01/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=72449&amp;bpg=">Icenian 2021</a></td>
				<td>Regional</td>
				<td><a href="http://www.cuoc.org.uk" target="_blank">CUOC</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Brandon</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 31/01/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75886&amp;bpg="> Middle Distance Thurstaston Common National Event</a></td>
				<td>National</td>
				<td><a href="http://www.deeside-orienteering-club.org.uk" target="_blank">DEE</a></td>
				<td>NWOA</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ246858&amp;z=126">Thurstaston Common</a></td>
				<td>Hoylake</td>
				<td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SJ246858&amp;z=126">SJ246858</a></td></tr><tr style="background-color: #FFF"><td>Sun 31/01/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=76100&amp;bpg=">BOK Regional Event</a></td>
				<td>Regional</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td>TBC</td>
				<td>Bristol</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 07/02/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75609&amp;bpg=">Southern Championships</a></td>
				<td>Major</td>
				<td><a href="http://www.mvoc.org" target="_blank">MV</a></td>
				<td>SEOA</td>
				<td>Ashdown South</td>
				<td>Crowborough</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 14/02/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75368&amp;bpg=">East Anglian Championships</a></td>
				<td>National</td>
				<td><a href="http://www.waoc.org.uk" target="_blank">WAOC</a></td>
				<td>EAOA</td>
				<td>Thetford Warren/Risbeth Warren</td>
				<td>Thetford</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 20/02/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75279&amp;bpg=">British Night Championships (UKOL)</a></td>
				<td>Major</td>
				<td><a href="http://www.ngoc.org.uk" target="_blank">NGOC</a></td>
				<td>SWOA</td>
				<td></td>
				<td>South West</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 28/02/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75830&amp;bpg=">SROC National event</a></td>
				<td>National</td>
				<td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
				<td>NWOA</td>
				<td>Whitbarrow Scar</td>
				<td>Kendal</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 28/02/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=76366&amp;bpg=">Interland</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td>Belgium</td>
				<td>Belgium</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 28/02/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=76430&amp;bpg=">TVOC Chiltern Challenge National Event </a></td>
				<td>National</td>
				<td><a href="http://www.tvoc.org.uk" target="_blank">TVOC</a></td>
				<td>SCOA</td>
				<td>TBC</td>
				<td>High Wycombe </td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 07/03/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75284&amp;bpg=">Welsh Orienteering Championships</a></td>
				<td>National</td>
				<td><a href="http://www.sboc.org.uk" target="_blank">SBOC</a></td>
				<td>WOA</td>
				<td></td>
				<td>South Wales</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 14/03/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75281&amp;bpg=">CompassSport Cup Heat</a></td>
				<td>National</td>
				<td></td>
				<td></td>
				<td></td>
				<td>All</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 21/03/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=76384&amp;bpg=">SYO National Event (tbc)</a></td>
				<td>National</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td>Tankersley</td>
				<td>Barnsley</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 27/03/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=76223&amp;bpg=">STAG Double Spring Weekend </a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>North Lanarkshire</td>
				<td>Glasgow</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 28/03/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=76224&amp;bpg=">STAG Double Spring Weekend - SoSOL</a></td>
				<td>Local</td>
				<td><a href="http://www.stag-orienteering.co.uk" target="_blank">STAG</a></td>
				<td>SOA</td>
				<td>North Lanarkshire</td>
				<td>Glasgow</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Fri 02/04/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75271&amp;bpg=">Jan Kjellström Orienteering Festival - Sprint (UKOL)</a></td>
				<td>Major</td>
				<td></td>
				<td>SWOA</td>
				<td>Plymouth Hoe</td>
				<td>South West</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 03/04/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75272&amp;bpg=">Jan Kjellström Orienteering Festival - Middle (UKOL)</a></td>
				<td>Major</td>
				<td></td>
				<td>SWOA</td>
				<td>Hayle Towans</td>
				<td>South West</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 04/04/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75273&amp;bpg=">Jan Kjellström Orienteering Festival - Long (UKOL)</a></td>
				<td>Major</td>
				<td></td>
				<td>SWOA</td>
				<td>Penhale</td>
				<td>South West</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Mon 05/04/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75274&amp;bpg=">Jan Kjellström Orienteering Festival - Relays</a></td>
				<td>Major</td>
				<td></td>
				<td>SWOA</td>
				<td>Penhale</td>
				<td>South West</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 11/04/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=76107&amp;bpg=">EM League 2021</a></td>
				<td>Regional</td>
				<td><a href="http://www.logonline.org.uk" target="_blank">LOG</a></td>
				<td>EMOA</td>
				<td>Stoke Rochford</td>
				<td>Grantham</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 25/04/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=76413&amp;bpg=">Alternative weekend for BOC/BRC (tbc)</a></td>
				<td>Major</td>
				<td></td>
				<td></td>
				<td></td>
				<td>??</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 01/05/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=73680&amp;bpg=">Tio Mila 1-2 May</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Sweden</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 02/05/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=76101&amp;bpg=">Mike Nelson BOK Trot</a></td>
				<td>Regional</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td>TBC</td>
				<td>Bristol</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 08/05/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75275&amp;bpg=">Northern Champs (tbc) and maybe British Orienteering Championships (UKOL) (tbc)</a></td>
				<td>Major</td>
				<td></td>
				<td></td>
				<td></td>
				<td>North</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 08/05/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75903&amp;bpg=">Ancient Wiltshire weekend</a></td>
				<td>Local</td>
				<td><a href="http://www.sarumo.org.uk" target="_blank">SARUM</a></td>
				<td>SWOA</td>
				<td>Amesbury South</td>
				<td>Amesbury</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 09/05/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75276&amp;bpg=">maybe British Relay Championships (tbc)</a></td>
				<td>Major</td>
				<td></td>
				<td></td>
				<td></td>
				<td>North</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 09/05/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=76423&amp;bpg=">?Ancient Wiltshire Weekend</a></td>
				<td>Local</td>
				<td><a href="http://northwilts.org.uk" target="_blank">NWO</a></td>
				<td>SWOA</td>
				<td>?Savernake Forest</td>
				<td>Marlborough</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 15/05/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75710&amp;bpg=">National Event</a></td>
				<td>National</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td></td>
				<td>West Yorkshire</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 16/05/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75711&amp;bpg=">National Event</a></td>
				<td>National</td>
				<td><a href="http://www.aire.org.uk" target="_blank">AIRE</a></td>
				<td>YHOA</td>
				<td>Monk's Road, Malham</td>
				<td>Skipton</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 16/05/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=76365&amp;bpg=">Colchester Urban</a></td>
				<td>National</td>
				<td><a href="http://stragglers.info" target="_blank">SOS</a></td>
				<td>EAOA</td>
				<td></td>
				<td>Colchester</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Mon 24/05/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75238&amp;bpg=">World Masters Orienteering Championships 24-29 May</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Japan</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 29/05/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75282&amp;bpg=">Scottish Championships - Individual</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Scotland</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 30/05/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75283&amp;bpg=">Scottish Championships - Relays</a></td>
				<td>Regional</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Scotland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 05/06/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=76125&amp;bpg=">BOK Blast Day 1</a></td>
				<td>National</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td>Wells &amp; Shepton Mallet?</td>
				<td>Shepton Mallet</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 06/06/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=76102&amp;bpg=">BOK Blast Day 2</a></td>
				<td>National</td>
				<td><a href="http://www.bristolorienteering.org.uk" target="_blank">BOK</a></td>
				<td>SWOA</td>
				<td>Wells &amp; Shepton Mallet?</td>
				<td>Shepton Mallet</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 12/06/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=73681&amp;bpg=">Jukola Relay 12-13 June</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Finland</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 19/06/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75278&amp;bpg=">British Mixed Sprint Relays</a></td>
				<td>National</td>
				<td></td>
				<td>YHOA</td>
				<td></td>
				<td>Yorkshire</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 20/06/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75277&amp;bpg=">British Sprint Championships (UKOL)</a></td>
				<td>Major</td>
				<td></td>
				<td>YHOA</td>
				<td></td>
				<td>Yorkshire</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 27/06/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=73339&amp;bpg=">Harvester Relays???</a></td>
				<td>National</td>
				<td></td>
				<td></td>
				<td></td>
				<td>???</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 04/07/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75008&amp;bpg=">Yvette Baker Trophy Final</a></td>
				<td>National</td>
				<td><a href="http://www.leioc.org.uk" target="_blank">LEI</a></td>
				<td>EMOA</td>
				<td>Irchester Country Park</td>
				<td>Wellingborough</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 04/07/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75239&amp;bpg=">World Orienteering Championships 4-8 Jul</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Czech Republic</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 11/07/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=74227&amp;bpg=">Junior World Orienteering Championships 11-18 July</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Portugal</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Thu 15/07/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=74229&amp;bpg=">World Games 15-25 July</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Birmingham, USA</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 25/07/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=73682&amp;bpg=">Oringen 25-30 July</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>??</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 04/09/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75287&amp;bpg=">Senior Home Internationals Individual</a></td>
				<td>National</td>
				<td><a href="http://www.nwoc.info" target="_blank">NWOC</a></td>
				<td>NIOA</td>
				<td></td>
				<td>Northern Ireland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 05/09/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75288&amp;bpg=">Senior Home Internationals Relays</a></td>
				<td>National</td>
				<td><a href="http://www.nwoc.info" target="_blank">NWOC</a></td>
				<td>NIOA</td>
				<td></td>
				<td>Northern Ireland</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 12/09/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75293&amp;bpg=">Peter Palmer Junior Team Relays</a></td>
				<td>National</td>
				<td><a href="http://www.coboc.org.uk" target="_blank">COBOC</a></td>
				<td>WMOA</td>
				<td></td>
				<td>Birmingham</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 19/09/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=76385&amp;bpg=">SYO National Event (tbc)</a></td>
				<td>National</td>
				<td><a href="http://southyorkshireorienteers.org.uk" target="_blank">SYO</a></td>
				<td>YHOA</td>
				<td>Wharncliffe South</td>
				<td>Sheffield</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 25/09/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75285&amp;bpg=">Junior Inter Regional Championships</a></td>
				<td>National</td>
				<td><a href="http://www.clok.org.uk" target="_blank">CLOK</a></td>
				<td>NEOA</td>
				<td></td>
				<td>North East</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 26/09/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75286&amp;bpg=">Junior Inter Regional Championships</a></td>
				<td>National</td>
				<td><a href="http://www.clok.org.uk" target="_blank">CLOK</a></td>
				<td>NEOA</td>
				<td></td>
				<td>North East</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 02/10/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75289&amp;bpg=">Veteran Home Internationals Individual</a></td>
				<td>National</td>
				<td></td>
				<td>SCOA</td>
				<td></td>
				<td>South Central</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 03/10/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75292&amp;bpg=">Veteran Home Internationals Relays</a></td>
				<td>National</td>
				<td></td>
				<td>SCOA</td>
				<td></td>
				<td>South Central</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 09/10/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=74228&amp;bpg=">25manna</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Sweden</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 09/10/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75290&amp;bpg=">Junior Home Internationals Individual</a></td>
				<td>National</td>
				<td></td>
				<td>WOA</td>
				<td></td>
				<td>Wales</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 09/10/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75294&amp;bpg=">British Schools Score Championships</a></td>
				<td>National</td>
				<td></td>
				<td></td>
				<td></td>
				<td>??</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 10/10/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75291&amp;bpg=">Junior Home Internationals Relays</a></td>
				<td>National</td>
				<td></td>
				<td>WOA</td>
				<td></td>
				<td>Wales</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 17/10/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75280&amp;bpg=">CompassSport Cup Final</a></td>
				<td>Major</td>
				<td><a href="http://www.dvo.org.uk/" target="_blank">DVO</a></td>
				<td>EMOA</td>
				<td></td>
				<td>Chesterfield</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 21/11/21</td>
				<td><a href="index.php?pg=event&amp;amp;event=75295&amp;bpg=">British Schools Orienteering Championships</a></td>
				<td>National</td>
				<td></td>
				<td></td>
				<td></td>
				<td>???</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 03/04/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=76412&amp;bpg=">Northern Championships (UKOL) or 22/5/22 (tbc)</a></td>
				<td>Major</td>
				<td><a href="http://www.newcastleorienteering.org.uk" target="_blank">NATO</a></td>
				<td>NEOA</td>
				<td></td>
				<td>Newcastle</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Fri 15/04/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=76292&amp;bpg=">Jan Kjellström Orienteering Festival - Sprint (UKOL)</a></td>
				<td>Major</td>
				<td></td>
				<td>WOA</td>
				<td></td>
				<td>Wales</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 16/04/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=76293&amp;bpg=">Jan Kjellström Orienteering Festival - Middle (UKOL)</a></td>
				<td>Major</td>
				<td></td>
				<td>WOA</td>
				<td></td>
				<td>Wales</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 17/04/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=76294&amp;bpg=">Jan Kjellström Orienteering Festival - Long (UKOL)</a></td>
				<td>Major</td>
				<td></td>
				<td>WOA</td>
				<td></td>
				<td>Wales</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Mon 18/04/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=76295&amp;bpg=">Jan Kjellström Orienteering Festival - Relays</a></td>
				<td>Major</td>
				<td></td>
				<td>WOA</td>
				<td></td>
				<td>Wales</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 07/05/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=76296&amp;bpg=">British Sprint Championships (UKOL)</a></td>
				<td>Major</td>
				<td></td>
				<td>NIOA</td>
				<td></td>
				<td>Northern Ireland</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 08/05/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=76297&amp;bpg=">British Middle Distance Championships (UKOL)</a></td>
				<td>Major</td>
				<td></td>
				<td>NIOA</td>
				<td></td>
				<td>Northern Ireland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 22/05/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=75446&amp;bpg=">Northern Championships (UKOL) or 3/4/22 (tbc)</a></td>
				<td>Major</td>
				<td><a href="http://www.newcastleorienteering.org.uk" target="_blank">NATO</a></td>
				<td>NEOA</td>
				<td></td>
				<td>Newcastle</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 02/07/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=76082&amp;bpg=">Birmingham University Sprint (Provisional)</a></td>
				<td>Regional</td>
				<td><a href="http://www.harlequins.org.uk" target="_blank">HOC</a></td>
				<td>WMOA</td>
				<td></td>
				<td>Birmingham</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sun 03/07/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=76083&amp;bpg=">Birmingham Urban European City Race Tour (Provisional)</a></td>
				<td>Regional</td>
				<td><a href="http://www.harlequins.org.uk" target="_blank">HOC</a></td>
				<td>WMOA</td>
				<td></td>
				<td>Birmingham</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sat 09/07/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=75240&amp;bpg=">World Orienteering Championships 9-13 July</a></td>
				<td>International</td>
				<td></td>
				<td></td>
				<td></td>
				<td>Edinburgh, Scotland</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Sat 09/07/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=75355&amp;bpg=">WOC 2022 Public Races</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Edinburgh</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Sun 10/07/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=75356&amp;bpg=">WOC 2022 Public Races</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Edinburgh</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Mon 11/07/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=75357&amp;bpg=">WOC 2022 Public Races</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Edinburgh</td>
				<td></td></tr><tr style="background-color: #EEE"><td>Tue 12/07/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=75358&amp;bpg=">WOC 2022 Public Races</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Edinburgh</td>
				<td></td></tr><tr style="background-color: #FFF"><td>Wed 13/07/22</td>
				<td><a href="index.php?pg=event&amp;amp;event=75359&amp;bpg=">WOC 2022 Public Races</a></td>
				<td>National</td>
				<td></td>
				<td>SOA</td>
				<td></td>
				<td>Edinburgh</td>
				<td></td></tr></table></div>	</body>
</html>
`;
