#!/usr/bin/perl

use strict;
use warnings;

print "Content-type: text/plain\n\n";
print "Step 1: Basic Perl OK\n";

# Check file existence
my $fname = "/home/ikatake/local/bslg/state.txt";
if (-e $fname) {
    print "Step 2: state.txt exists OK\n";
    print "  File size: " . (-s $fname) . " bytes\n";
} else {
    print "Step 2 ERROR: state.txt not found at $fname\n";
}

# Check library paths
my $lib1 = "/home/ikatake/local/bslg/extlib/lib/perl5";
my $lib2 = "/home/ikatake/local/bslg/extlib/lib/perl5/i386-freebsd-64int";

if (-d $lib1) {
    print "Step 3: Library path 1 exists OK\n";
} else {
    print "Step 3 ERROR: $lib1 not found\n";
}

if (-d $lib2) {
    print "Step 4: Library path 2 exists OK\n";
} else {
    print "Step 4 ERROR: $lib2 not found\n";
}

print "\nNow testing CGI module...\n";
eval {
    require CGI;
    CGI->import();
    print "Step 5: CGI module loaded OK\n";
};
if ($@) {
    print "Step 5 ERROR: $@\n";
}

print "\nNow testing JSON module...\n";
eval {
    require JSON;
    JSON->import();
    print "Step 6: JSON module loaded OK\n";
};
if ($@) {
    print "Step 6 ERROR: $@\n";
}

print "\nTest completed.\n";
