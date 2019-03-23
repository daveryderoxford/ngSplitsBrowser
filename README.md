# Splitsbrowser

Angular program for displaying orienteering results.

Data is store on google cloud. 

It was originally written by Dave Ryder as a Java application many years ago and rewritten/emhanced probcipally by

## Development 

## Supported file format

Splitsbrowser supports the following results file formats

* IOF XML version 3  https://orienteering.org/resources/it/data-standard-3-0/
* IOF XML version 2  https://orienteering.org/resources/it/data-standard-2-0/
* OE format
CSV output from OE Results application.
Variations supporting 44, 46 and 60 columns before the controls data are supported. 

* CSV Format
Simple, fixed csv format with the following columns

* Alternate CVS format
Alternative CSV formats, where each row defines a separate competitor, and includes course details such as name, controls and optionally distance and climb.
There is presently one variation supported: one, distinguished by having three columns per control: control codecumulative time and 'points'.  

 * HTML Format
Attempt to parse 

