#!/usr/bin/perl

use strict;
use warnings;

print "Content-type: text/plain\n\n";
print "Step 1: Basic Perl OK\n";

eval {
    use CGI;
    print "Step 2: CGI module OK\n";
};
if ($@) {
    print "Step 2 ERROR: $@\n";
}

eval {
    use JSON;
    print "Step 3: JSON module OK\n";
};
if ($@) {
    print "Step 3 ERROR: $@\n";
}

my $fname = "/home/ikatake/local/bslg/state.txt";
if (-e $fname) {
    print "Step 4: state.txt exists OK\n";
} else {
    print "Step 4 ERROR: state.txt not found at $fname\n";
}

print "\nTest completed.\n";
