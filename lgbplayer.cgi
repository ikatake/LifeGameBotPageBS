#!/usr/bin/perl

use strict;
use warnings;
use FindBin;
use lib "/home/ikatake/local/twlg/extlib/lib/perl5", "home/ikatake/local/twlg/extlib/lib/perl5/i386-freebsd-64int";
use CGI;
use JSON;

my $q = new CGI;
my $call = $q->param('call');

if($call eq 'reload') {
	&reload();
}
elsif($call eq 'jump') {
	my $run = $q->param('run');
	my $gene = $q->param('gene');
	&jump($run, $gene);
}
elsif($call eq 'measure') {
	&measure();
}

sub reload {
	my $data = &load_current();
	print "Content-type: application/json; charset=utf-8\n\n";
	print encode_json( $data );
}
sub jump {
	my $state_str = "";
	my $fname = '/home/ikatake/www/wetsteam/LifeGameBotBS/stateLogs/';
	my $str = "";
	my $gene = 0;
	my $run = 0;
	my $data;
	$fname .= sprintf("%08d",$_[0]). "/";
	$fname .= sprintf("%08d",$_[1]). ".txt";
	print $fname;
	if(!(-e $fname)) { #file is not exist.
		for(my $ii = 0; $ii < 10; $ii++) {
			$state_str .= "1111111111\n";
		}
		$data = {run => -1, gene => -1,state => $state_str,};
		print "Content-type: application/json; charset=utf-8\n\n";
		print encode_json( $data );
		return;
	}
	open( my $fh, "<", $fname )
        	or die "Cannot open $fname: $!";
	while( my $line = readline($fh)) {
#	        $line = decode( 'UTF-8', $line);
		my @column = split(/\t/, $line);
		if( $#column != 1 )
		{#状態の読込み
			$state_str .= $line;
		}	
		elsif( $column[0] eq 'gene' )
		{
			$gene = int($column[1]);
		}
		elsif( $column[0] eq 'run' )
		{
			$run = int($column[1]);
		}			
	}
	close $fh;

	$data = {
		run => $run,
		gene => $gene,
		state => $state_str,
	};

	print "Content-type: application/json; charset=utf-8\n\n";
	print encode_json( $data );
}
sub measure {
	my $state_str = "";
	my $fname = "/home/ikatake/local/bslg/state.txt";
	my $gene = 0;
	my $run = 0;
	my @arlen = ();
	my $bdname = '/home/ikatake/www/wetsteam/LifeGameBotBS/stateLogs/';
	my $dname = "";
	my $str = "";
	my @directory;
	my %hash;
	my $data = &load_current();
	$run = $data->{run};
	$gene = $data->{gene};
	
	for(my $ii = 1; $ii <= $run; $ii++) {
		my $len;
		$dname = $bdname . sprintf("%08d",$ii) . '/';
		if(!(-e $dname)) { #file is not exist.
			$len = -1;
		}
		else {
			opendir(my $dh, $dname) or die "$dname:$!";
			@directory = grep {/\.txt$/} readdir($dh);
			closedir($dh);
			$len = @directory;
		}
		my %hash = ('run' => $ii, 'length' => $len);
		push(@arlen, \%hash );
	}
	foreach my $tmp(@arlen) {
		foreach my $key(keys %$tmp) {
	#		print "key = $key Value = $tmp->{$key} \n";
		}
	}
	print "Content-type: application/json; charset=utf-8\n\n";
	print encode_json( \@arlen );
}
sub load_current {
	my $state_str = "";
	my $fname = "/home/ikatake/local/bslg/state.txt";
	my $str = "";
	my $gene = 0;
	my $run = 0;
	my $data;
	
	# デバッグ用ログファイル
	open(my $debug_fh, ">", "/home/ikatake/local/bslg/debug.log");
	
	open( my $fh, "<", $fname )
        	or die "Cannot open $fname: $!";
	while( my $line = readline($fh)) {
		print $debug_fh "Line: [$line]\n";
		my @column = split(/\t/, $line);
		print $debug_fh "Column count: " . ($#column + 1) . ", Index: $#column\n";
		print $debug_fh "Column[0]: [$column[0]]\n" if defined $column[0];
		print $debug_fh "Column[1]: [$column[1]]\n" if defined $column[1];
		
		if( $#column != 1 ) {#状態の読込み
			$state_str .= $line;
			print $debug_fh "-> State line\n";
		}	
		elsif( $column[0] eq 'gene' ) {
			$gene = int($column[1]);
			print $debug_fh "-> Gene: $gene\n";
		}
		elsif( $column[0] eq 'run' ) {
			$run = int($column[1]);
			print $debug_fh "-> Run: $run\n";
		}			
	}
	close $fh;
	close $debug_fh;

	$data = {
		run => $run,
		gene => $gene,
		state => $state_str,
	};
	return $data;
}