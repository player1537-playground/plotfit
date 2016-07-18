#!/bin/bash

getmodtime() {
    local file regex
    file=$1
    regex='^[0-9]+$'
    for command in "stat -f %Sm -t %s" "date +%s -r"; do
        result=$($command "$file" 2>/dev/null)
        if [[ $result =~ $regex ]]; then
            echo "$result"
            return 0
        fi
    done

    echo "No suitable command" >&2
    exit 5
}

main() {
    local RELOAD=0
    local DIRECTORY=0
    local CLEAR=0
    local POSTPONE=0
    local error=0
    local i command files changed modtimes pid
    while [[ $1 =~ ^- ]]; do
        for ((i=1; i<${#1}; ++i)); do
            local opt=${1:$i:1}
            case "${opt}" in
                r) RELOAD=1;;
                d) DIRECTORY=1;;
                c) CLEAR=1;;
                p) POSTPONE=1;;
                *) echo 'Unknown opt: $opt' >&2; error=1;;
            esac
        done
        shift
    done

    if [[ $RELOAD != 0 ]]; then
        trap '[ -n "$pid" ] && kill $pid; wait; exit' INT TERM EXIT
    fi

    if [[ $# == 0 ]]; then
        echo "No command given" >&2
        error=2
    fi

    if [[ $CLEAR != 0 ]]; then
        echo "Not implemented: clear" >&2
        error=3
    fi

    if [[ $error != 0 ]]; then
        exit $error
    fi

    files=( )
    while true; do
        local file
        read file || break
        if [[ -n $file ]]; then
            files+=( "$file" )

            if [[ $DIRECTORY == 0 ]]; then
                continue
            fi

            local dir="$file"
            while [ ! -d "$dir" ]; do
                dir=${dir%/*}
            done

            files+=( "$dir" )
        fi
    done

    modtimes=( )
    for ((i=0; i<${#files[@]}; ++i)); do
        local file=${files[$i]}
        local modtime=$(getmodtime "$file")
        modtimes+=( "$modtime" )
    done

    pid=""
    changed=( "${files[@]}" )
    while true; do
        # Execute command
        if [[ $POSTPONE == 0 ]]; then
            command=( "$@" )

            for ((i=0; i<$#; ++i)); do
                arg=command[$i]
                arg=${!arg}
                if [[ $arg =~ /_ ]]; then
                    command[$i]=${changed[0]}
                fi
            done

            if [[ $RELOAD != 0 ]]; then
                if [[ $pid != "" ]]; then
                    kill $pid
                    wait
                fi

                "${command[@]}" &
                pid=$!
            else
                if ! "${command[@]}"; then
                    exit $?
                fi
            fi
        fi

        changed=( )
        while [[ ${#changed[@]} == 0 ]]; do
            sleep 0.5
            for ((i=0; i<${#files[@]}; ++i)); do
                local file=${files[$i]}
                local modtime=$(getmodtime "$file")
                if [[ $modtime != ${modtimes[$i]} ]]; then
                    changed+=( "$file" )
                    modtimes[$i]=$modtime
                    if [ -d "$file" ]; then
                        exit 0
                    fi
                fi
            done
        done

        POSTPONE=0
    done
}

main "$@"
