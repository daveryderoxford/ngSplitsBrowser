#!/usr/bin/env python
# Script to (partially) convert QTest tests to Jasmine.

import os
import fileinput

def processEqualAssert(line, assertstring, replacement):
    if assertstring in line:
        line = line.replace(assertstring, 'expect(')
        components = line.split(',')
        if len(components) == 2:
             # 2 parameters - no commnet
            line = components[0] + ')' + replacement + components[1].strip() + '\n'
        elif len(components) == 3:
            # 3 parameters - comment
            line = components[0] + ')' + replacement + components[1].strip() + ').because(' + components[2]
        else:
            # More than 3 parameters - not eaay to differentaite just output the replacement
            # Remove \n from last element
            line = line[:-1]
            line = line + '  **' + replacement + '** \n'
    return line

def processTruthy(line, assertstring, replacement):
    if assertstring in line:
        line = line.replace(assertstring, 'expect(')
        components = line.split(',')

         # Remove ;\n from last element
        lastel = len(components)-1
        components[lastel] = components[lastel][:-2]

        if len(components) == 1:
            line = components[0] +  replacement + ';\n'
        elif len(components) == 2:
            # 2 parameters - comment
            line = components[0] + replacement  + '.because(' + components[1] + ';\n'
        else:
            #   Move than 2 parameters - not eaay to differentaite just output the replacement
            # Remove \n from last element
            line = line[:-1]
            line = line + '   **' + replacement + '** \n'

    return line

def processfdescribe(line):
    if 'module(' in line:
        line = line.replace('module(', 'fdescribe(')
        line = line[:-2] + ', () => {\n'
        return line
    else:
        return line

DIRLIST = os.listdir("./")

for filename in DIRLIST:
    if filename.endswith('.js'):
        outfilename = filename.replace('-test.js', '.spec.ts')
        with open(outfilename, 'w') as outfile:
            for inputline in fileinput.input(filename):
                outline = inputline.replace('QUnit.test(', 'it(')
                outline = outline.replace(', function (assert)', ', () =>')
                outline = outline.replace('    "use strict";', '')
                outline = outline.replace('var ', 'let ')
                outline = outline.replace('(function () {', '')
                outline = outline.replace('})();', '}')
                outline = outline.replace('function () {', '() => {')

                outline = processfdescribe(outline)
                outline = processEqualAssert(outline, 'assert.deepEqual(', '.EqualTo(')
                outline = processEqualAssert(outline, 'assert.strictEqual(', '.EqualTo(')
                outline = processTruthy(outline, 'assert.ok(', '.toBeTruthy()')
                outfile.write(outline)
