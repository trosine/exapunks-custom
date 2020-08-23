// For the latest Axiom VirtualNetwork+ scripting documentation,
// please visit: http://www.zachtronics.com/virtualnetwork/

function getTitle() {
    return "File Replacement";
}

function getSubtitle() {
    return "POWERED BY EXAS®";
}

function getDescription() {
    var description = "File 199 contains a list of files, which are part of a RAID5 configuration. " +
        "One of those files has been wiped, so you will need to reproduce its contents.\n" +
        "The data is written in 4-bit blocks, with an odd-parity block - the parity bit states whether the number of 1's for that bit across the stripe is odd.\n" +
        "For example, if the stripe contained the blocks 1011, 0010, 1100, the parity block would be 0101 (the first bit is 1,0,1 = 0 - even; " +
        "the second bit is 0,0,1 = 1 - odd; the third bit is 1,1,0 = 0 - even; and the fourth bit is 1,0,0 = 1 - odd).\n"
    ;
    return description;
}

function initializeTestRun(testRun) {
    var targetHost = createHost("target", 5, -2, 4, 6);
    var file_count = randomInt(3, 7);
    var wiped_file = randomInt(0, file_count-1);
    var data_size = randomInt(10, 30);
    var data_files = [];
    var data_file_numbers = [];
    var data_contents = [];

    for (var x = 0; x < file_count; x++) {
        // make sure we create unique file numbers
        var filenum = randomInt(201, 299);
        while (data_file_numbers.indexOf(filenum) >= 0) {
            filenum = randomInt(201, 299);
        }
        data_file_numbers[x] = filenum;

        // create the array of present data
        var contents = [];
        if (x != wiped_file) {
            for (var d = 0; d < data_size; d++) {
                var decimal = randomInt(0, 15);
                contents.push(parseInt(decimal.toString(2), 10));
            }
            // this is intended to be a file_count-1 length array
            data_contents.push(contents);
        }

        data_files[x] = createNormalFile(targetHost, filenum, FILE_ICON_ARCHIVE, contents);
        setFileColumnCount(data_files[x], 5);
    }

    // Calculate the parity blocks
    var missing_contents = [];
    for (var x = 0; x < data_size; x++) {
        var parity = 0;
        for (var y = 0; y < file_count - 1; y++) {
            parity  = parity ^ parseInt(data_contents[y][x].toString(10), 2);
        }
        missing_contents[x] = parseInt(parity.toString(2), 10);
    }

    var directory = createNormalFile(targetHost, 199, FILE_ICON_FOLDER, data_file_numbers);

    // Requirements
    requireChangeFile(data_files[wiped_file], missing_contents, "Create the missing data");
}

function onCycleFinished() {
}
