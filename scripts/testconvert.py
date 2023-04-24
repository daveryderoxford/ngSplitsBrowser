#!/usr/bin/env python
# Script to (partially) convert QTest tests to Jasmine.

import os
import fileinput

def convertArrays(line):
    # Swap comma characters within an array for ^ character so arrays are not split
    # note only processes first arrray.  if multiple arrays present process manually
    start = line.rfind("[")
    end = line.rfind("]")
    if start == -1:
        return line
    else:
        bracket = line[start:end]
        bracket = bracket.replace("," , "#")
        line = line[:start] + bracket + line[end:]
    return line

def convertArraysBack(line):
    # Swap ^ characters back to commas
    line.replace("#", ",")
    return line

def processEqualAssert(line, assertstring, replacement):
    if assertstring in line:
        line = convertArrays(line)
        line = line.replace(assertstring, 'expect(')
        components = line.split(',')
        if len(components) == 2:
             # 2 parameters - no commnet
            line = components[0] + ')' + replacement + components[1].strip() + '\n'
        elif len(components) == 3:
            # 3 parameters - comment
            line = components[0] + ')' + replacement + components[1].strip() + ', ' + components[2]
        else:
            # More than 3 parameters - not eaay to differentaite just output the replacement
            # Remove \n from last element
            line = line[:-1]
            line = line + '  **' + replacement + '** \n'
        line = convertArraysBack(line)
    return line

def processTruthy(line, assertstring, replacement):
    if assertstring in line:
        line = convertArrays(line)
        line = line.replace(assertstring, 'expect(')
        components = line.split(',')

         # Remove ;\n from last element
        lastel = len(components)-1
        components[lastel] = components[lastel][:-2]

        if len(components) == 1:
            line = components[0] + replacement + ');\n'
        elif len(components) == 2:
            # 2 parameters - comment
            line = components[0] + ')' + replacement  + ','  + components[1] + ';\n'
        else:
            # Move than 2 parameters - not eaay to differentaite just output the replacement
            # Remove \n from last element
            line = line[:-1]
            line = line + '   **' + replacement + '** \n'
        line = convertArraysBack(line)
    return line

def processfdescribe(line):
    if 'module(' in line:
        line = line.replace('module(', 'fdescribe(')
        line = line[:-2] + ', () => {\n'
    return line

DIRLIST = os.listdir("./")

for filename in DIRLIST:
    if filename.endswith('.js'):
        outfilename = filename.replace('-test.js', '.spec.ts')
        with open(outfilename, 'w') as outfile:

            outfile.write("// tslint:disable:max-line-length\n")
            outfile.write('import {} from "jasmine";\n')
            outfile.write('import {} from "jasmine-expect";\n')

            for inputline in fileinput.input(filename):
                outline = inputline.replace('QUnit.test(', 'it(')
                outline = outline.replace(', function (assert)', ', () =>')
                outline = outline.replace('    "use strict";', '')

                outline = outline.replace('var ', 'const ')
                outline = outline.replace('for (const', 'for (let')
              
                outline = outline.replace('(function () {', '')
                outline = outline.replace('})();', '}')
                outline = outline.replace('function () {', '() => {')

                outline = outline.replace('        \n', '\n')
                outline = outline.replace('       \n', '\n')
                outline = outline.replace('      \n', '\n')
                outline = outline.replace('     \n', '\n')
                outline = outline.replace('    \n', '\n')
                outline = outline.replace('   \n', '\n')
                outline = outline.replace('  \n', '\n')
                outline = outline.replace(' \n', '\n')

                outline = outline.replace('function (assert,', 'function (')
                outline = outline.replace('(assert,', '(')

                outline = outline.replace('(SplitsBrowserTest.', 'TestSupport.')

                outline = processfdescribe(outline)
                outline = processEqualAssert(outline, 'assert.deepEqual(', '.toEqual(')
                outline = processEqualAssert(outline, 'assert.strictEqual(', '.toEqual(')
                outline = processTruthy(outline, 'assert.ok(', '.toBe(true')

                outfile.write(outline)
