export interface RGSite {
   name: string;
   shortName: string;
   rgUKPrifix: string;
   isNonStandard: boolean | null;
   baseURL: string;
   notes: string;
}

export const RGSITES: RGSite[] = [
   {
      "name": "Airienteers",
      "shortName": "aire",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.aire.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Ayrshire OC",
      "shortName": "ayroc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.ayroc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Badenoch & Strathspey OC",
      "shortName": "basoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.basoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Basingstoke Andover District",
      "shortName": "bado",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.bado.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Berkshire Orienteers",
      "shortName": "bko",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.bko.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Border Liners",
      "shortName": "bl",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.bl.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Bristol OK",
      "shortName": "bok",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.bok.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "British Army OC",
      "shortName": "baoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.baoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Cambridge University OC",
      "shortName": "cuoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.cuoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Chigwell & Epping Forest OC",
      "shortName": "chig",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.chig.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "City of Birmingham",
      "shortName": "coboc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.coboc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Claro",
      "shortName": "claro",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.claro.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Cleveland Orienteering Klub",
      "shortName": "clok",
      "rgUKPrifix": "",
      "isNonStandard": true,
      "baseURL": "https://www.clok.routegadget.co.uk/gadget/",
      "notes": "Additional 'gadget' string in API request (https://www.clok.routegadget.co.uk/gadget/rg2/rg2api.php?type=events)"
   },
   {
      "name": "Clydeside OC",
      "shortName": "clyde",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.clyde.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Cornwall OC",
      "shortName": "kerno",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.kerno.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Dartford Orienteering Klubb",
      "shortName": "dfok",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.dfok.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Deeside OC",
      "shortName": "dee",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.dee.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Derwent Valley Orienteers",
      "shortName": "dvo",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.dvo.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Devon OC",
      "shortName": "devon",
      "rgUKPrifix": "devonoc",
      "isNonStandard": null,
      "baseURL": "https://www.devonoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "EBOR",
      "shortName": "ebor",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.ebor.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "East Lothian Orienteers",
      "shortName": "elo",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.elo.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "East Pennine OC",
      "shortName": "epoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.epoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Edinburgh Southern OC",
      "shortName": "esoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.esoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Edinburgh University OC",
      "shortName": "euoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.euoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Eryri Orienteers",
      "shortName": "eryri",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.eryri.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Essex Stragglers",
      "shortName": "sos",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.sos.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Forth Valley Orienteers",
      "shortName": "fvo",
      "rgUKPrifix": "",
      "isNonStandard": true,
      "baseURL": "https://routegadget.fvo.org.uk/",
      "notes": "Namers and routegadget the other way round and no wwww (https://routegadget.fvo.org.uk/rg2/)"
   },
   {
      "name": "Grampian Orienteers",
      "shortName": "gramp",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.gramp.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Guildford Orienteers",
      "shortName": "go",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.go.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Harlequins OC",
      "shortName": "hoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.hoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Havering & South Essex OC",
      "shortName": "havoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.havoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Hertfordshire Orienteering Club",
      "shortName": "hh",
      "rgUKPrifix": "happyherts",
      "isNonStandard": null,
      "baseURL": "https://www.happyherts.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Humberside & Lincs Orienteers",
      "shortName": "halo",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.halo.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Interlopers",
      "shortName": "int",
      "rgUKPrifix": "interlopers",
      "isNonStandard": null,
      "baseURL": "https://www.interlopers.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Invoc",
      "shortName": "invoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.invoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Kingdom of Fife",
      "shortName": "kfo",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.kfo.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Lagan Valley",
      "shortName": "lvo",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.lvo.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Lakeland OC",
      "shortName": "loc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.loc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Leicester OC",
      "shortName": "lei",
      "rgUKPrifix": "leioc",
      "isNonStandard": null,
      "baseURL": "https://www.leioc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Lincoln OG",
      "shortName": "log",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.log.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Loch Eck Orienteers",
      "shortName": "ecko",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.ecko.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "London O Klub",
      "shortName": "lok",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.lok.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Manchester & District OC",
      "shortName": "mdoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.mdoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Maroc",
      "shortName": "maroc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.maroc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Masterplan Adventure",
      "shortName": "masterplanadventure",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.masterplanadventure.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Mid Wales Orienteers",
      "shortName": "mwoc",
      "rgUKPrifix": "mid-wales",
      "isNonStandard": null,
      "baseURL": "https://www.mid-wales.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Mole Valley OC",
      "shortName": "mv",
      "rgUKPrifix": "mvoc",
      "isNonStandard": null,
      "baseURL": "https://www.mvoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Moravian Orienteers",
      "shortName": "mor",
      "rgUKPrifix": "moravian",
      "isNonStandard": null,
      "baseURL": "https://www.moravian.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Newcastle & Tyneside OC",
      "shortName": "nato",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.nato.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Norfolk OC",
      "shortName": "nor",
      "rgUKPrifix": "noroc",
      "isNonStandard": null,
      "baseURL": "https://www.noroc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "North Gloucestershire OC",
      "shortName": "ngoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.ngoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "North Wilts O",
      "shortName": "nwo",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.nwo.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Northern Navigators",
      "shortName": "nn",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.nn.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Nottingham OC",
      "shortName": "noc",
      "rgUKPrifix": "",
      "isNonStandard": true,
      "baseURL": "http://www.noc-uk.org/gadget/",
      "notes": "local installation at http://www.noc-uk.org/gadget/rg2/"
   },
   {
      "name": "Octavian Droobers",
      "shortName": "od",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.od.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Oxford University OC",
      "shortName": "ouoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.ouoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Pendle Forest Orienteers",
      "shortName": "pfo",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.pfo.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Potteries OC",
      "shortName": "potoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.potoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Quantock Orienteers",
      "shortName": "qo",
      "rgUKPrifix": "quantock",
      "isNonStandard": null,
      "baseURL": "https://www.quantock.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Roxburgh Reivers",
      "shortName": "rr",
      "rgUKPrifix": "roxburghreivers",
      "isNonStandard": null,
      "baseURL": "https://www.roxburghreivers.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Royal Air Force",
      "shortName": "rafo",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.rafo.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "SAXONS",
      "shortName": "saxons",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.saxons.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "SE Lancs OC",
      "shortName": "seloc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.seloc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Sarum OC",
      "shortName": "sarum",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.sarum.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Solway OC",
      "shortName": "sol",
      "rgUKPrifix": "solway",
      "isNonStandard": null,
      "baseURL": "https://www.solway.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "South London Orienteers",
      "shortName": "slow",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.slow.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "South Midlands OC",
      "shortName": "smoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.smoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "South Ribble OC",
      "shortName": "sroc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.sroc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "South Wales OC",
      "shortName": "swoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.swoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "South Yorkshire Orienteers",
      "shortName": "syo",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.syo.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Southampton OC",
      "shortName": "soc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.soc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Southdowns OC",
      "shortName": "so",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.so.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Southern Navigators",
      "shortName": "sn",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.sn.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Stag",
      "shortName": "stag",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.stag.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Suffolk",
      "shortName": "suffoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.suffoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Swansea Bay",
      "shortName": "sboc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.sboc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Tayside Orienteers",
      "shortName": "tay",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.tay.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Thames Valley OC",
      "shortName": "tvoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.tvoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Tinto",
      "shortName": "tinto",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.tinto.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Walton Chasers",
      "shortName": "wch",
      "rgUKPrifix": "walton",
      "isNonStandard": null,
      "baseURL": "https://www.walton.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Warrior OC",
      "shortName": "waroc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.waroc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Wessex OC",
      "shortName": "wsx",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.wsx.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "West Anglia OC",
      "shortName": "waoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.waoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "West Cumbria OC",
      "shortName": "wcoc",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.wcoc.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Wimborne Orienteers",
      "shortName": "wim",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.wim.routegadget.co.uk/",
      "notes": ""
   },
   {
      "name": "Wrekin",
      "shortName": "wrekin",
      "rgUKPrifix": "",
      "isNonStandard": null,
      "baseURL": "https://www.wrekin.routegadget.co.uk/",
      "notes": ""
   }
];
