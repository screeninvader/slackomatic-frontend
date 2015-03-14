slackomatic frontend
====

To run:

    make node #download and install raspbian node packages
    make npm #installs babeljs, forever and express dependencies

    # ! if port 80 then you need root for all commands from here on !
    make dev #rebuilds babeljs and restarts node
    #or
    make run #just restarts node, no babel

    make list #lists running forever processes

    make stopall #stopall running forever processes
