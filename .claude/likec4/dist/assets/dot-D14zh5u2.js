var e=e=>{switch(e){case`index`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=index,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    subgraph cluster_workers {
        graph [color="#2d333d",
            fillcolor="#3e4651",
            label=<<FONT POINT-SIZE="11" COLOR="#cbd5e1b3"><B>THE WORKERS (THE SPOKES)</B></FONT>>,
            likec4_depth=1,
            likec4_id=workers,
            likec4_level=0,
            margin=40,
            style=filled
        ];
        engineer [color="#4e0cc3",
            fillcolor="#7C3AED",
            fontcolor="#ffffff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">engineer</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the back-end worker —<BR/>business logic, endpoints, hooks,<BR/>types, error factories. Spawned s b<BR/>w, certified by respawn. Never<BR/>writes tests, JSX, or CSS.</FONT></TD></TR></TABLE>>,
            likec4_id="workers.engineer",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        testerunit [color="#4e0cc3",
            fillcolor="#7C3AED",
            fontcolor="#ffffff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-unit</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the micro tier — one<BR/>back-end function alone; every<BR/>branch, boundary, empty/null,<BR/>error. Never a component (the UI is<BR/>proved by the composition tier).</FONT></TD></TR></TABLE>>,
            likec4_id="workers.testerUnit",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        frontend [color="#4e0cc3",
            fillcolor="#7C3AED",
            fontcolor="#ffffff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">frontend</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the UI worker —<BR/>components, layout, styling, the<BR/>shared component system. Built<BR/>last, against functions already<BR/>proved. Label frontend-ui.</FONT></TD></TR></TABLE>>,
            likec4_id="workers.frontend",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        testerfeature [color="#4e0cc3",
            fillcolor="#7C3AED",
            fontcolor="#ffffff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-feature</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the composition tier —<BR/>one feature's pieces proved wired;<BR/>its errors and successes surface.<BR/>Never re-runs the unit tier's<BR/>edge-case matrix. Label</FONT></TD></TR></TABLE>>,
            likec4_id="workers.testerFeature",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        testere2e [color="#4e0cc3",
            fillcolor="#7C3AED",
            fontcolor="#ffffff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-e2e</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the broad tier —<BR/>journeys across features on the<BR/>real stack; cross-feature state;<BR/>one success + one failure per<BR/>feature. Label epic-e2e-test, skill</FONT></TD></TR></TABLE>>,
            likec4_id="workers.testerE2e",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        reviewagent [color="#4e0cc3",
            fillcolor="#7C3AED",
            fontcolor="#ffffff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">review</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the reviewer — three<BR/>questions from first principles:<BR/>does the code do what its source of<BR/>truth demands, do the tests prove<BR/>it, is it simple and readable. Maps</FONT></TD></TR></TABLE>>,
            likec4_id="workers.reviewAgent",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        mergeagent [color="#4e0cc3",
            fillcolor="#7C3AED",
            fontcolor="#ffffff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">merge</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the epic-tier assembler<BR/>— reads the feature branches off<BR/>the feature gates, assembles them<BR/>onto the epic branch in its own<BR/>worktree, resolves the conflicts</FONT></TD></TR></TABLE>>,
            likec4_id="workers.mergeAgent",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
    }
    subgraph cluster_errors {
        graph [color="#2d333d",
            fillcolor="#3e4651",
            label=<<FONT POINT-SIZE="11" COLOR="#cbd5e1b3"><B>THE ALARM VOCABULARY</B></FONT>>,
            likec4_depth=1,
            likec4_id=errors,
            likec4_level=0,
            margin=40,
            style=filled
        ];
        labelambiguous [color="#ad0005",
            fillcolor="#DC2626",
            fontcolor="#fffff3",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=label-ambiguous</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: zero or two dispatching<BR/>labels on a claim. The dispatcher<BR/>never guesses a specialist — the<BR/>ticket is LEFT CLAIMED so its lease<BR/>parks it off the frontier, and the</FONT></TD></TR></TABLE>>,
            likec4_id="errors.labelAmbiguous",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        frontierempty [color="#ad0005",
            fillcolor="#DC2626",
            fontcolor="#fffff3",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">reason=frontier_empty</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: the empty frontier's<BR/>first state — nothing left to do.</FONT></TD></TR></TABLE>>,
            likec4_id="errors.frontierEmpty",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
    }
    subgraph cluster_tower {
        graph [color="#292f37",
            fillcolor="#3a404a",
            label=<<FONT POINT-SIZE="11" COLOR="#cbd5e1b3"><B>THE TOWER (ONE BEADS DB)</B></FONT>>,
            likec4_depth=2,
            likec4_id=tower,
            likec4_level=0,
            margin=32,
            style=filled
        ];
        subgraph cluster_feata {
            graph [color="#5d320a",
                fillcolor="#764610",
                label=<<FONT POINT-SIZE="11" COLOR="#ffffffb3"><B>FEATURE — ADD A RECIPE (RECIPE-5)</B></FONT>>,
                likec4_depth=1,
                likec4_id="tower.epic.featA",
                likec4_level=1,
                margin=32,
                style=filled
            ];
            backenda [color="#415167",
                fillcolor="#64748B",
                fontcolor="#ffffff",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">backend-logic (RECIPE-6)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>validateRecipe + saveRecipe — pure<BR/>functions<BR/>label:    backend-logic<BR/>agent: engineer</FONT></TD></TR></TABLE>>,
                likec4_id="tower.epic.featA.backendA",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
        }
    }
    dispatcher [color="#0042c2",
        fillcolor="#2563EB",
        fontcolor="#f1ffff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">bo loop — the dispatcher</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ddf2ff">What it is: CLI/beads-loop.sh — the<BR/>one command (bo loop) that turns<BR/>beads tickets into background<BR/>workers.Steps it runs, one per<BR/>tick:reads the branches already at</FONT></TD></TR></TABLE>>,
        likec4_id=dispatcher,
        likec4_level=0,
        margin="0.389,0.223",
        width=4.584];
    dispatcher -> engineer [arrowhead=normal,
        color="#1c4ab0",
        fontcolor="#f1ffff",
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">backend-logic</FONT></TD></TR></TABLE>>,
        likec4_id="88sakf",
        style=dashed,
        weight=4];
    dispatcher -> testerunit [arrowhead=normal,
        color="#1c4ab0",
        fontcolor="#f1ffff",
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">unit-tests</FONT></TD></TR></TABLE>>,
        likec4_id="1lgky75",
        minlen=1,
        style=dashed];
    dispatcher -> frontend [arrowhead=normal,
        color="#1c4ab0",
        fontcolor="#f1ffff",
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">frontend-ui</FONT></TD></TR></TABLE>>,
        likec4_id="1ac3lew",
        minlen=1,
        style=dashed];
    dispatcher -> testerfeature [arrowhead=normal,
        color="#1c4ab0",
        fontcolor="#f1ffff",
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">feature-test</FONT></TD></TR></TABLE>>,
        likec4_id="1eckser",
        minlen=1,
        style=dashed];
    dispatcher -> testere2e [arrowhead=normal,
        color="#1c4ab0",
        fontcolor="#f1ffff",
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">epic-e2e-test</FONT></TD></TR></TABLE>>,
        likec4_id="1qo7zp",
        minlen=1,
        style=dashed];
    dispatcher -> reviewagent [arrowhead=normal,
        color="#1c4ab0",
        fontcolor="#f1ffff",
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14"><B>[...]</B></FONT></TD></TR></TABLE>>,
        likec4_id="15kpd51",
        minlen=1,
        style=dashed];
    dispatcher -> mergeagent [arrowhead=normal,
        color="#1c4ab0",
        fontcolor="#f1ffff",
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">epic-merge-pr</FONT></TD></TR></TABLE>>,
        likec4_id="5ty9l3",
        minlen=1,
        style=dashed];
    dispatcher -> labelambiguous [arrowhead=normal,
        color="#a51d1d",
        fontcolor="#fffff3",
        likec4_id="1klgyqa",
        minlen=1,
        style=dotted];
    dispatcher -> frontierempty [arrowhead=normal,
        color="#a51d1d",
        fontcolor="#fffff3",
        likec4_id="16mpusi",
        minlen=1,
        style=dotted];
    beads [color="#484f5c",
        fillcolor="#6B7280",
        fontcolor="#ffffff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">beads DB (bd)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fdffff">What it is: the beads issue<BR/>database — the loop's only runtime<BR/>input. None of the contract docs<BR/>are read at runtime; the graph<BR/>lives here.Verbs the tower uses: bd</FONT></TD></TR></TABLE>>,
        likec4_id=beads,
        likec4_level=0,
        margin="0.112,0",
        penwidth=2,
        shape=cylinder,
        width=4.445];
    dispatcher -> beads [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">bd ready --claim / bd unclaim</FONT></TD></TR></TABLE>>,
        likec4_id="19knbj0",
        style=dashed,
        weight=2];
    origin [color="#484f5c",
        fillcolor="#6B7280",
        fontcolor="#ffffff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">origin — GitHub</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fdffff">What it is: the remote the tower<BR/>publishes to. main at the bottom,<BR/>one PR per branch above it:<BR/>feature/&lt;slug&gt; → PR → the epic<BR/>branch, epic/&lt;slug&gt; → PR → main.</FONT></TD></TR></TABLE>>,
        likec4_id=origin,
        likec4_level=0,
        margin="0.112,0",
        penwidth=2,
        shape=cylinder,
        width=4.445];
    dispatcher -> origin [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">ensureEpicGatePr — push epic branch,<BR/>open PR, write pr on the gate</FONT></TD></TR></TABLE>>,
        likec4_id="5jaluh",
        style=dashed,
        weight=2];
    hook [color="#00516b",
        fillcolor="#0E7490",
        fontcolor="#ceffff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">hooks/worker-stop.sh — the Stop hook</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#b9ffff">What it is: the fail-closed<BR/>gatekeeper that fires when a worker<BR/>session stops.Steps:checks<BR/>$BO_DONE_FILE — no marker, no<BR/>commit, no push, no PR, no close</FONT></TD></TR></TABLE>>,
        likec4_id=hook,
        likec4_level=0,
        margin="0.389,0.223",
        width=4.584];
    hook -> origin [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">commit, push, PR — only when<BR/>BO_DONE_FILE exists</FONT></TD></TR></TABLE>>,
        likec4_id="1lm3sjh",
        minlen=1,
        style=dashed,
        weight=2];
    human [color="#484f5c",
        fillcolor="#6B7280",
        fontcolor="#ffffff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Human (Brodie)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fdffff">What it is: the only one who closes<BR/>gates. Workers leave their tickets<BR/>open and report in their final<BR/>message; the human reads the<BR/>report, verifies the branch, and</FONT></TD></TR></TABLE>>,
        likec4_id=human,
        likec4_level=0,
        margin="0.112,0.223",
        width=4.445];
    human -> backenda [arrowhead=normal,
        color="#a35905",
        fontcolor="#ffffff",
        lhead=cluster_feata,
        likec4_id="1hp83ja",
        minlen=1,
        style=dashed,
        weight=3,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">after feature-review</FONT></TD></TR></TABLE>>];
    decisions [color="#484f5c",
        fillcolor="#6B7280",
        fontcolor="#ffffff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Decision points</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fdffff">What it is: the judgments the<BR/>machine cannot make — everything<BR/>else is mechanical.Plan-epic: what<BR/>the epic is — one epic, one<BR/>epic/&lt;slug&gt; of 2–4 lowercase words</FONT></TD></TR></TABLE>>,
        likec4_id=decisions,
        likec4_level=0,
        margin="0.112,0.223",
        width=4.445];
    planepic [color="#006c8c",
        fillcolor="#0891B2",
        fontcolor="#ffffff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">plan-epic</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9ffff">What it is: conversational epic<BR/>architect — vague idea → clarifying<BR/>questions → research → exactly one<BR/>epic gate plus epic-merge-pr,<BR/>epic-e2e-test, epic-review. Writes</FONT></TD></TR></TABLE>>,
        likec4_id="planAgents.planEpic",
        likec4_level=0,
        margin="0.112,0.223",
        width=4.445];
    decisions -> planepic [style=invis];
    engineer -> beads [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">bd heartbeat — keep the lease alive</FONT></TD></TR></TABLE>>,
        likec4_id=aovbrd,
        style=dashed,
        weight=4];
    engineer -> origin [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">commit on the branch (via the Stop hook,<BR/>never directly)</FONT></TD></TR></TABLE>>,
        likec4_id="1szp6r0",
        style=dashed,
        weight=4];
    engineer -> backenda [arrowhead=normal,
        color="#5d2cb2",
        fontcolor="#ffffff",
        likec4_id="4e2k8w",
        style=dashed];
}
`;case`towerMap`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=towerMap,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    subgraph cluster_epic {
        graph [color="#532e0c",
            fillcolor="#694012",
            label=<<FONT POINT-SIZE="11" COLOR="#ffffffb3"><B>EPIC — RECIPE BOX (RECIPE-1)</B></FONT>>,
            likec4_depth=2,
            likec4_id="tower.epic",
            likec4_level=0,
            margin=40,
            style=filled
        ];
        subgraph cluster_feata {
            graph [color="#5d320a",
                fillcolor="#764610",
                label=<<FONT POINT-SIZE="11" COLOR="#ffffffb3"><B>FEATURE — ADD A RECIPE (RECIPE-5)</B></FONT>>,
                likec4_depth=1,
                likec4_id="tower.epic.featA",
                likec4_level=1,
                margin=40,
                style=filled
            ];
            backenda [color="#415167",
                fillcolor="#64748B",
                fontcolor="#ffffff",
                group="tower.epic.featA",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">backend-logic (RECIPE-6)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>validateRecipe + saveRecipe — pure<BR/>functions<BR/>label:    backend-logic<BR/>agent: engineer</FONT></TD></TR></TABLE>>,
                likec4_id="tower.epic.featA.backendA",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            unita [color="#415167",
                fillcolor="#64748B",
                fontcolor="#ffffff",
                group="tower.epic.featA",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">unit-tests (RECIPE-7)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>exhaustive coverage for<BR/>validateRecipe<BR/>label:    unit-tests<BR/>agent: tester-unit (respawn)</FONT></TD></TR></TABLE>>,
                likec4_id="tower.epic.featA.unitA",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            frontenda [color="#415167",
                fillcolor="#64748B",
                fontcolor="#ffffff",
                group="tower.epic.featA",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">frontend-ui (RECIPE-8)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>RecipeForm + RecipeCard against<BR/>proved functions<BR/>label:    frontend-ui<BR/>agent: frontend</FONT></TD></TR></TABLE>>,
                likec4_id="tower.epic.featA.frontendA",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            featuretesta [color="#415167",
                fillcolor="#64748B",
                fontcolor="#ffffff",
                group="tower.epic.featA",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">feature-test (RECIPE-9)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the add-recipe pieces are wired<BR/>label:    feature-test<BR/>agent: tester-feature (respawn)<BR/>category: feature-test</FONT></TD></TR></TABLE>>,
                likec4_id="tower.epic.featA.featureTestA",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            featurereviewa [color="#415167",
                fillcolor="#64748B",
                fontcolor="#ffffff",
                group="tower.epic.featA",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">feature-review (RECIPE-10)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the three questions over<BR/>feature/add-recipe<BR/>label:    feature-review<BR/>agent: review (respawn)</FONT></TD></TR></TABLE>>,
                likec4_id="tower.epic.featA.featureReviewA",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
        }
        subgraph cluster_featb {
            graph [color="#5d320a",
                fillcolor="#764610",
                label=<<FONT POINT-SIZE="11" COLOR="#ffffffb3"><B>FEATURE — SEARCH THE BOX (RECIPE-11)</B></FONT>>,
                likec4_depth=1,
                likec4_id="tower.epic.featB",
                likec4_level=1,
                margin=40,
                style=filled
            ];
            backendb [color="#415167",
                fillcolor="#64748B",
                fontcolor="#ffffff",
                group="tower.epic.featB",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">backend-logic (RECIPE-12)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>searchRecipes — pure filter over<BR/>the repository port<BR/>label:    backend-logic<BR/>agent: engineer</FONT></TD></TR></TABLE>>,
                likec4_id="tower.epic.featB.backendB",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            unitb [color="#415167",
                fillcolor="#64748B",
                fontcolor="#ffffff",
                group="tower.epic.featB",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">unit-tests (RECIPE-13)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>exhaustive coverage for<BR/>searchRecipes<BR/>label:    unit-tests<BR/>agent: tester-unit (respawn)</FONT></TD></TR></TABLE>>,
                likec4_id="tower.epic.featB.unitB",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            frontendb [color="#415167",
                fillcolor="#64748B",
                fontcolor="#ffffff",
                group="tower.epic.featB",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">frontend-ui (RECIPE-14)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>SearchBar + live results list<BR/>label:    frontend-ui<BR/>agent: frontend<BR/>category: frontend-ux</FONT></TD></TR></TABLE>>,
                likec4_id="tower.epic.featB.frontendB",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            featuretestb [color="#415167",
                fillcolor="#64748B",
                fontcolor="#ffffff",
                group="tower.epic.featB",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">feature-test (RECIPE-15)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the search pieces are wired<BR/>label:    feature-test<BR/>agent: tester-feature (respawn)<BR/>category: feature-test</FONT></TD></TR></TABLE>>,
                likec4_id="tower.epic.featB.featureTestB",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            featurereviewb [color="#415167",
                fillcolor="#64748B",
                fontcolor="#ffffff",
                group="tower.epic.featB",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">feature-review (RECIPE-16)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the three questions over<BR/>feature/search-recipes<BR/>label:    feature-review<BR/>agent: review (respawn)</FONT></TD></TR></TABLE>>,
                likec4_id="tower.epic.featB.featureReviewB",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
        }
        epicmergepr [color="#415167",
            fillcolor="#64748B",
            fontcolor="#ffffff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">epic-merge-pr (RECIPE-2)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>assemble the feature branches onto<BR/>epic/recipe-box<BR/>label:    epic-merge-pr<BR/>agent: merge</FONT></TD></TR></TABLE>>,
            likec4_id="tower.epic.epicMergePr",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        epice2e [color="#415167",
            fillcolor="#64748B",
            fontcolor="#ffffff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">epic-e2e-test (RECIPE-3)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>journeys across the whole app in a<BR/>real browser<BR/>label:    epic-e2e-test<BR/>agent: tester-e2e (respawn)</FONT></TD></TR></TABLE>>,
            likec4_id="tower.epic.epicE2e",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        epicreview [color="#415167",
            fillcolor="#64748B",
            fontcolor="#ffffff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">epic-review (RECIPE-4)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the three questions over the whole<BR/>epic<BR/>label:    epic-review<BR/>agent: review (respawn)</FONT></TD></TR></TABLE>>,
            likec4_id="tower.epic.epicReview",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
    }
    backenda -> unita [arrowhead=normal,
        color="#505660",
        fontcolor="#ffffff",
        likec4_id="1g0y7m0",
        minlen=1,
        style=dashed];
    backendb -> unitb [arrowhead=normal,
        color="#505660",
        fontcolor="#ffffff",
        likec4_id="1klarqg",
        minlen=1,
        style=dashed];
    epicmergepr -> epice2e [arrowhead=normal,
        color="#505660",
        fontcolor="#ffffff",
        likec4_id=yus4ci,
        style=dashed];
    unita -> frontenda [arrowhead=normal,
        color="#505660",
        fontcolor="#ffffff",
        likec4_id=tkcw2q,
        style=dashed];
    unitb -> frontendb [arrowhead=normal,
        color="#505660",
        fontcolor="#ffffff",
        likec4_id=x4a3z6,
        style=dashed];
    epice2e -> epicreview [arrowhead=normal,
        color="#505660",
        fontcolor="#ffffff",
        likec4_id="6kcl42",
        minlen=1,
        style=dashed];
    frontenda -> featuretesta [arrowhead=normal,
        color="#505660",
        fontcolor="#ffffff",
        likec4_id=qa8n46,
        style=dashed];
    frontendb -> featuretestb [arrowhead=normal,
        color="#505660",
        fontcolor="#ffffff",
        likec4_id="1h0wrom",
        style=dashed];
    featuretesta -> featurereviewa [arrowhead=normal,
        color="#505660",
        fontcolor="#ffffff",
        likec4_id=r5clfq,
        style=dashed];
    featuretestb -> featurereviewb [arrowhead=normal,
        color="#505660",
        fontcolor="#ffffff",
        likec4_id="6jzjie",
        style=dashed];
    featurereviewa -> epicmergepr [arrowhead=normal,
        color="#505660",
        fontcolor="#ffffff",
        likec4_id=b0h9qw,
        ltail=cluster_feata,
        style=dashed];
    featurereviewb -> epicmergepr [arrowhead=normal,
        color="#505660",
        fontcolor="#ffffff",
        likec4_id="1xl3oor",
        ltail=cluster_featb,
        style=dashed];
}
`;case`allBranches`:return`digraph {
  likec4_viewId = "allBranches";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "TB";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.806;
  ranksep = 1.806;
  pad = 0.209;
  fontname = "Arial";
  newrank = true;
  clusterrank = "global";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "mergerun" [
    likec4_id = "worktreesRoot.wtEpic.mergeRun";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">merge</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the epic-tier assembler<BR/>— reads the feature branches off<BR/>the feature gates, assembles them<BR/>onto the epic branch in its own<BR/>worktree, resolves the conflicts</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "e2erun" [
    likec4_id = "worktreesRoot.wtEpic.e2eRun";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-e2e</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the broad tier —<BR/>journeys across features on the<BR/>real stack; cross-feature state;<BR/>one success + one failure per<BR/>feature. Label epic-e2e-test, skill</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "epicreviewrun" [
    likec4_id = "worktreesRoot.wtEpic.epicReviewRun";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">review</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the reviewer — three<BR/>questions from first principles:<BR/>does the code do what its source of<BR/>truth demands, do the tests prove<BR/>it, is it simple and readable. Maps</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "enga" [
    likec4_id = "worktreesRoot.wtA.engA";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">engineer</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the back-end worker —<BR/>business logic, endpoints, hooks,<BR/>types, error factories. Spawned s b<BR/>w, certified by respawn. Never<BR/>writes tests, JSX, or CSS.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "unita" [
    likec4_id = "worktreesRoot.wtA.unitA";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-unit</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the micro tier — one<BR/>back-end function alone; every<BR/>branch, boundary, empty/null,<BR/>error. Never a component (the UI is<BR/>proved by the composition tier).</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "fea" [
    likec4_id = "worktreesRoot.wtA.feA";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">frontend</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the UI worker —<BR/>components, layout, styling, the<BR/>shared component system. Built<BR/>last, against functions already<BR/>proved. Label frontend-ui.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "fta" [
    likec4_id = "worktreesRoot.wtA.ftA";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-feature</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the composition tier —<BR/>one feature's pieces proved wired;<BR/>its errors and successes surface.<BR/>Never re-runs the unit tier's<BR/>edge-case matrix. Label</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "reva" [
    likec4_id = "worktreesRoot.wtA.revA";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">review</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the reviewer — three<BR/>questions from first principles:<BR/>does the code do what its source of<BR/>truth demands, do the tests prove<BR/>it, is it simple and readable. Maps</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "engb" [
    likec4_id = "worktreesRoot.wtB.engB";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">engineer</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the back-end worker —<BR/>business logic, endpoints, hooks,<BR/>types, error factories. Spawned s b<BR/>w, certified by respawn. Never<BR/>writes tests, JSX, or CSS.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "unitb" [
    likec4_id = "worktreesRoot.wtB.unitB";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-unit</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the micro tier — one<BR/>back-end function alone; every<BR/>branch, boundary, empty/null,<BR/>error. Never a component (the UI is<BR/>proved by the composition tier).</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "feb" [
    likec4_id = "worktreesRoot.wtB.feB";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">frontend</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the UI worker —<BR/>components, layout, styling, the<BR/>shared component system. Built<BR/>last, against functions already<BR/>proved. Label frontend-ui.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "ftb" [
    likec4_id = "worktreesRoot.wtB.ftB";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-feature</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the composition tier —<BR/>one feature's pieces proved wired;<BR/>its errors and successes surface.<BR/>Never re-runs the unit tier's<BR/>edge-case matrix. Label</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "revb" [
    likec4_id = "worktreesRoot.wtB.revB";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">review</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the reviewer — three<BR/>questions from first principles:<BR/>does the code do what its source of<BR/>truth demands, do the tests prove<BR/>it, is it simple and readable. Maps</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "t_merge" [
    likec4_id = "worktreesRoot.wtEpic.t_merge";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">epic-merge-pr (RECIPE-2)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>assemble the feature branches onto<BR/>epic/recipe-box<BR/>label:    epic-merge-pr<BR/>agent: merge</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_backenda" [
    likec4_id = "worktreesRoot.wtA.t_backendA";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">backend-logic (RECIPE-6)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>validateRecipe + saveRecipe — pure<BR/>functions<BR/>label:    backend-logic<BR/>agent: engineer</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_backendb" [
    likec4_id = "worktreesRoot.wtB.t_backendB";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">backend-logic (RECIPE-12)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>searchRecipes — pure filter over<BR/>the repository port<BR/>label:    backend-logic<BR/>agent: engineer</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_e2e" [
    likec4_id = "worktreesRoot.wtEpic.t_e2e";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">epic-e2e-test (RECIPE-3)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>journeys across the whole app in a<BR/>real browser<BR/>label:    epic-e2e-test<BR/>agent: tester-e2e (respawn)</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_unita" [
    likec4_id = "worktreesRoot.wtA.t_unitA";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">unit-tests (RECIPE-7)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>exhaustive coverage for<BR/>validateRecipe<BR/>label:    unit-tests<BR/>agent: tester-unit (respawn)</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_unitb" [
    likec4_id = "worktreesRoot.wtB.t_unitB";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">unit-tests (RECIPE-13)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>exhaustive coverage for<BR/>searchRecipes<BR/>label:    unit-tests<BR/>agent: tester-unit (respawn)</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_epicreview" [
    likec4_id = "worktreesRoot.wtEpic.t_epicReview";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">epic-review (RECIPE-4)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the three questions over the whole<BR/>epic<BR/>label:    epic-review<BR/>agent: review (respawn)</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_fronta" [
    likec4_id = "worktreesRoot.wtA.t_frontA";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">frontend-ui (RECIPE-8)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>RecipeForm + RecipeCard against<BR/>proved functions<BR/>label:    frontend-ui<BR/>agent: frontend</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_frontb" [
    likec4_id = "worktreesRoot.wtB.t_frontB";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">frontend-ui (RECIPE-14)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>SearchBar + live results list<BR/>label:    frontend-ui<BR/>agent: frontend<BR/>category: frontend-ux</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_ftesta" [
    likec4_id = "worktreesRoot.wtA.t_ftestA";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">feature-test (RECIPE-9)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the add-recipe pieces are wired<BR/>label:    feature-test<BR/>agent: tester-feature (respawn)<BR/>category: feature-test</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_ftestb" [
    likec4_id = "worktreesRoot.wtB.t_ftestB";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">feature-test (RECIPE-15)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the search pieces are wired<BR/>label:    feature-test<BR/>agent: tester-feature (respawn)<BR/>category: feature-test</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_freva" [
    likec4_id = "worktreesRoot.wtA.t_frevA";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">feature-review (RECIPE-10)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the three questions over<BR/>feature/add-recipe<BR/>label:    feature-review<BR/>agent: review (respawn)</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_frevb" [
    likec4_id = "worktreesRoot.wtB.t_frevB";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">feature-review (RECIPE-16)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the three questions over<BR/>feature/search-recipes<BR/>label:    feature-review<BR/>agent: review (respawn)</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  subgraph "cluster_worktreesroot" {
    likec4_id = "worktreesRoot";
    likec4_level = 0;
    likec4_depth = 2;
    fillcolor = "#0d4936";
    color = "#083625";
    style = "filled";
    margin = 50;
    label = <<FONT POINT-SIZE="11" COLOR="#eeffffb3"><B>.CLAUDE/WORKTREES/ — ONE BOX PER BRANCH</B></FONT>>;
    subgraph "cluster_wtepic" {
      likec4_id = "worktreesRoot.wtEpic";
      likec4_level = 1;
      likec4_depth = 1;
      fillcolor = "#0c513c";
      color = "#073c28";
      style = "filled";
      margin = 50;
      label = <<FONT POINT-SIZE="11" COLOR="#eeffffb3"><B>EPIC+RECIPE-BOX → EPIC/RECIPE-BOX</B></FONT>>;
      "mergerun";
      "e2erun";
      "epicreviewrun";
      "t_merge";
      "t_e2e";
      "t_epicreview";
    }
    subgraph "cluster_wta" {
      likec4_id = "worktreesRoot.wtA";
      likec4_level = 1;
      likec4_depth = 1;
      fillcolor = "#0c513c";
      color = "#073c28";
      style = "filled";
      margin = 50;
      label = <<FONT POINT-SIZE="11" COLOR="#eeffffb3"><B>FEATURE+ADD-RECIPE → FEATURE/ADD-RECIPE</B></FONT>>;
      "enga";
      "unita";
      "fea";
      "fta";
      "reva";
      "t_backenda";
      "t_unita";
      "t_fronta";
      "t_ftesta";
      "t_freva";
    }
    subgraph "cluster_wtb" {
      likec4_id = "worktreesRoot.wtB";
      likec4_level = 1;
      likec4_depth = 1;
      fillcolor = "#0c513c";
      color = "#073c28";
      style = "filled";
      margin = 50;
      label = <<FONT POINT-SIZE="11" COLOR="#eeffffb3"><B>FEATURE+SEARCH-RECIPES → FEATURE/SEARCH-RECIPES</B></FONT>>;
      "engb";
      "unitb";
      "feb";
      "ftb";
      "revb";
      "t_backendb";
      "t_unitb";
      "t_frontb";
      "t_ftestb";
      "t_frevb";
    }
  }
  subgraph {
    rank = "same";
    "epicreviewrun";
    "reva";
    "revb";
  }
  subgraph {
    rank = "same";
    "enga";
    "engb";
  }
  subgraph {
    rank = "same";
    "unita";
    "unitb";
  }
  subgraph {
    rank = "same";
    "fea";
    "feb";
  }
  subgraph {
    rank = "same";
    "fta";
    "ftb";
  }
  "mergerun" -> "t_merge" [
    likec4_id = "1l95cu";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — assemble</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "e2erun" -> "t_e2e" [
    likec4_id = "qowy8u";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — journeys</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "epicreviewrun" -> "t_epicreview" [
    likec4_id = "1o87wvy";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — PR comments</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "t_merge" -> "t_e2e" [
    likec4_id = "1db3fxy";
    style = "dashed";
    color = "#505660";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "t_e2e" -> "t_epicreview" [
    likec4_id = "1onrhhn";
    style = "dashed";
    color = "#505660";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "enga" -> "t_backenda" [
    likec4_id = "5nigv3";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — one commit</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "unita" -> "t_unita" [
    likec4_id = "1s6npuf";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — test commit</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "fea" -> "t_fronta" [
    likec4_id = "1gre3dh";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — UI commit</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "fta" -> "t_ftesta" [
    likec4_id = "1725ahh";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — suite</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "reva" -> "t_freva" [
    likec4_id = "zzqsa9";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — PR comments</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "t_backenda" -> "t_unita" [
    likec4_id = "1b0v5um";
    style = "dashed";
    color = "#505660";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "t_unita" -> "t_fronta" [
    likec4_id = "1pxfbp7";
    style = "dashed";
    color = "#505660";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "t_fronta" -> "t_ftesta" [
    likec4_id = "rh40h9";
    style = "dashed";
    color = "#505660";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "t_ftesta" -> "t_freva" [
    likec4_id = "1gx3td7";
    style = "dashed";
    color = "#505660";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "engb" -> "t_backendb" [
    likec4_id = "18qhejj";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — one commit</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "unitb" -> "t_unitb" [
    likec4_id = "1m7ynmf";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — test commit</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "feb" -> "t_frontb" [
    likec4_id = "amjpyt";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — UI commit</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "ftb" -> "t_ftestb" [
    likec4_id = "1as68ad";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — suite</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "revb" -> "t_frevb" [
    likec4_id = "1976vip";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — PR comments</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "t_backendb" -> "t_unitb" [
    likec4_id = "xn4v3y";
    style = "dashed";
    color = "#505660";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "t_unitb" -> "t_frontb" [
    likec4_id = "1r9m923";
    style = "dashed";
    color = "#505660";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "t_frontb" -> "t_ftestb" [
    likec4_id = "ywd1v1";
    style = "dashed";
    color = "#505660";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "t_ftestb" -> "t_frevb" [
    likec4_id = "ycxpvv";
    style = "dashed";
    color = "#505660";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
}`;case`planTower`:return`digraph {
  likec4_viewId = "planTower";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "human" [
    likec4_id = "human";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Human (Brodie)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fdffff">What it is: the only one who closes<BR/>gates. Workers leave their tickets<BR/>open and report in their final<BR/>message; the human reads the<BR/>report, verifies the branch, and</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6B7280";
    fontcolor = "#ffffff";
    color = "#484f5c";
  ];
  "planepic" [
    likec4_id = "planAgents.planEpic";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">plan-epic</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9ffff">What it is: conversational epic<BR/>architect — vague idea → clarifying<BR/>questions → research → exactly one<BR/>epic gate plus epic-merge-pr,<BR/>epic-e2e-test, epic-review. Writes</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#0891B2";
    fontcolor = "#ffffff";
    color = "#006c8c";
  ];
  "beads" [
    likec4_id = "beads";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">beads DB (bd)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fdffff">What it is: the beads issue<BR/>database — the loop's only runtime<BR/>input. None of the contract docs<BR/>are read at runtime; the graph<BR/>lives here.Verbs the tower uses: bd</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6B7280";
    fontcolor = "#ffffff";
    color = "#484f5c";
    penwidth = 2;
    shape = "cylinder";
  ];
  "planfeature" [
    likec4_id = "planAgents.planFeature";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">plan-feature</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9ffff">What it is: breaks an epic into<BR/>feature-sized features — complete<BR/>user-facing flows — each with its<BR/>own feature/&lt;slug&gt; branch, its<BR/>feature-test and feature-review</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#0891B2";
    fontcolor = "#ffffff";
    color = "#006c8c";
  ];
  "plantask" [
    likec4_id = "planAgents.planTask";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">plan-task</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9ffff">What it is: breaks ONE feature into<BR/>tasks, each parent-child to the<BR/>feature, labeled at creation with<BR/>bd create -l &lt;label&gt;, the feature's<BR/>branch copied verbatim (a plan</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#0891B2";
    fontcolor = "#ffffff";
    color = "#006c8c";
  ];
  "dispatcher" [
    likec4_id = "dispatcher";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">bo loop — the dispatcher</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ddf2ff">What it is: CLI/beads-loop.sh — the<BR/>one command (bo loop) that turns<BR/>beads tickets into background<BR/>workers.Steps it runs, one per<BR/>tick:reads the branches already at</FONT></TD></TR></TABLE>>;
    margin = "0.389,0.223";
    width = 4.584;
    height = 2.5;
    fillcolor = "#2563EB";
    fontcolor = "#f1ffff";
    color = "#0042c2";
  ];
  "human" -> "planepic" [
    likec4_id = "step-01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>0</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">'a recipe box app' — one vague idea</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "planepic" -> "beads" [
    likec4_id = "step-02";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">clarify, research, then create exactly<BR/>one epic gate + merge / e2e / review<BR/>tickets</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "human" -> "planfeature" [
    likec4_id = "step-03";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">plan the features for RECIPE-1</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "beads" -> "planfeature" [
    likec4_id = "step-04";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">RECIPE-5 feature/add-recipe and<BR/>RECIPE-11 feature/search-recipes, each<BR/>with feature-test and feature-review</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "human" -> "plantask" [
    likec4_id = "step-05";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">plan the tasks for RECIPE-5</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "beads" -> "plantask" [
    likec4_id = "step-06";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">RECIPE-6, RECIPE-7, RECIPE-8, chained<BR/>one to the next</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "human" -> "dispatcher" [
    likec4_id = "step-07";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">bo loop — and the tower starts walking<BR/>itself</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
}`;case`tickWalkthrough`:return`digraph {
  likec4_viewId = "tickWalkthrough";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "dispatcher" [
    likec4_id = "dispatcher";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">bo loop — the dispatcher</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ddf2ff">What it is: CLI/beads-loop.sh — the<BR/>one command (bo loop) that turns<BR/>beads tickets into background<BR/>workers.Steps it runs, one per<BR/>tick:reads the branches already at</FONT></TD></TR></TABLE>>;
    margin = "0.389,0.223";
    width = 4.584;
    height = 2.5;
    fillcolor = "#2563EB";
    fontcolor = "#f1ffff";
    color = "#0042c2";
  ];
  "beads" [
    likec4_id = "beads";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">beads DB (bd)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fdffff">What it is: the beads issue<BR/>database — the loop's only runtime<BR/>input. None of the contract docs<BR/>are read at runtime; the graph<BR/>lives here.Verbs the tower uses: bd</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6B7280";
    fontcolor = "#ffffff";
    color = "#484f5c";
    penwidth = 2;
    shape = "cylinder";
  ];
  "engineer" [
    likec4_id = "workers.engineer";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">engineer</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the back-end worker —<BR/>business logic, endpoints, hooks,<BR/>types, error factories. Spawned s b<BR/>w, certified by respawn. Never<BR/>writes tests, JSX, or CSS.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "labelambiguous" [
    likec4_id = "errors.labelAmbiguous";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=label-ambiguous</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: zero or two dispatching<BR/>labels on a claim. The dispatcher<BR/>never guesses a specialist — the<BR/>ticket is LEFT CLAIMED so its lease<BR/>parks it off the frontier, and the</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#DC2626";
    fontcolor = "#fffff3";
    color = "#ad0005";
  ];
  "metadatamissing" [
    likec4_id = "errors.metadataMissing";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=metadata-missing</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: no branch in the<BR/>claim's metadata — a plan agent<BR/>skipped its one key. Left claimed,<BR/>same treatment as a mislabelled<BR/>ticket. The loop never invents a</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#DC2626";
    fontcolor = "#fffff3";
    color = "#ad0005";
  ];
  "epic" [
    likec4_id = "tower.epic";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Epic — Recipe Box (RECIPE-1)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the epic gate — the<BR/>"what"; the human closes it once,<BR/>after epic-review is done.Branch:<BR/>epic/recipe-box → PR → main (the<BR/>loop publishes it and writes pr as</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#D97706";
    fontcolor = "#ffffff";
    color = "#ac5300";
  ];
  "branchbusy" [
    likec4_id = "errors.branchBusy";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=branch_busy held=N</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: tickets exist and are<BR/>claimable, but every branch they<BR/>want is already working. The<BR/>freshly claimed ticket goes<BR/>straight back (bd unclaim) and the</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#DC2626";
    fontcolor = "#fffff3";
    color = "#ad0005";
  ];
  "origin" [
    likec4_id = "origin";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">origin — GitHub</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fdffff">What it is: the remote the tower<BR/>publishes to. main at the bottom,<BR/>one PR per branch above it:<BR/>feature/&lt;slug&gt; → PR → the epic<BR/>branch, epic/&lt;slug&gt; → PR → main.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6B7280";
    fontcolor = "#ffffff";
    color = "#484f5c";
    penwidth = 2;
    shape = "cylinder";
  ];
  "epicprfailed" [
    likec4_id = "errors.epicPrFailed";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=epic-pr-failed step=…</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: the epic branch or its<BR/>PR could not be published. Steps:<BR/>walk, gate-branch, forge,<BR/>missing-tool, push, pr, annotate.<BR/>Left claimed — a worker spawned</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#DC2626";
    fontcolor = "#fffff3";
    color = "#ad0005";
  ];
  "worktreefailed" [
    likec4_id = "errors.worktreeFailed";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=worktree-failed</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: git worktree add failed<BR/>under .claude/worktrees/. Left<BR/>claimed — a worker spawned in a<BR/>missing folder burns a slot on<BR/>nothing.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#DC2626";
    fontcolor = "#fffff3";
    color = "#ad0005";
  ];
  "workernotdispatched" [
    likec4_id = "errors.workerNotDispatched";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=worker-not-dispatched</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: claude --bg spawned no<BR/>session. The ticket is put back<BR/>with bd unclaim so the next tick<BR/>can retry it.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#DC2626";
    fontcolor = "#fffff3";
    color = "#ad0005";
  ];
  "dispatcher" -> "beads" [
    likec4_id = "step-01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>0</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">probe the frontier: bd list --status<BR/>open,blocked --limit 0</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "beads" [
    likec4_id = "step-02";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">bd ready --claim (atomic — a bare bd<BR/>ready would let two loops steal the<BR/>ticket)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "engineer" [
    likec4_id = "step-03:alt.01:when.01";
    color = "#1c4ab0";
    fontcolor = "#f1ffff";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">AGENT[backend-logic] = engineer</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "labelambiguous" [
    likec4_id = "step-03:alt.02:else.01";
    style = "dotted";
    color = "#a51d1d";
    fontcolor = "#fffff3";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">never guesses a specialist</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "beads" [
    likec4_id = "step-03:alt.02:else.02";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">leave it CLAIMED — the lease parks it<BR/>off the frontier</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "beads" [
    likec4_id = "step-04:alt.01:when.01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">BO_BRANCH = feature/add-recipe — read<BR/>off the claim, nothing re-derives it,<BR/>nothing parses text</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "metadatamissing" [
    likec4_id = "step-04:alt.02:else.01";
    style = "dotted";
    color = "#a51d1d";
    fontcolor = "#fffff3";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">ERROR reason=metadata-missing — left<BR/>claimed</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "beads" [
    likec4_id = "step-05";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>7</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">branchesCurrentlyAtWork()</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "beads" [
    likec4_id = "step-06:alt.01:when.01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>8</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">bd unclaim RECIPE-6</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "branchbusy" [
    likec4_id = "step-06:alt.01:when.02";
    style = "dotted";
    color = "#a51d1d";
    fontcolor = "#fffff3";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>9</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">one pair of hands per branch; try the<BR/>next claim, max max_parallel + 2 per<BR/>tick</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "epic" [
    likec4_id = "step-06:alt.02:when.01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>10</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">walk RECIPE-5 to RECIPE-1 (epicGateOf,<BR/>two hops at most) — read the PR base off<BR/>the gate</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "origin" [
    likec4_id = "step-07:try.01:block.01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>11</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">ensureEpicGatePr — the gate has no pr:<BR/>push epic/recipe-box off main, open the<BR/>PR</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "beads" [
    likec4_id = "step-07:try.01:block.02";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>12</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">bd update RECIPE-1 --set-metadata<BR/>pr=https://github.com/…/pull/1 (merges —<BR/>never disturbs branch)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "epicprfailed" [
    likec4_id = "step-07:try.02:catch.01";
    style = "dotted";
    color = "#a51d1d";
    fontcolor = "#fffff3";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>13</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">left claimed — a worker under a<BR/>nonexistent epic branch burns a slot;<BR/>steps: walk, gate-branch, forge,<BR/>missing-tool, push, pr, annotate</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "beads" [
    likec4_id = "step-08";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>14</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">ensureWorktree — git worktree add<BR/>.claude/worktrees/feature+add-recipe<BR/>origin/feature/add-recipe</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "worktreefailed" [
    likec4_id = "step-09:alt.01:when.01";
    style = "dotted";
    color = "#a51d1d";
    fontcolor = "#fffff3";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>15</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">ERROR reason=worktree-failed — left<BR/>claimed</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "engineer" [
    likec4_id = "step-09:alt.02:when.01";
    color = "#1c4ab0";
    fontcolor = "#f1ffff";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>16</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">claude --bg --agent engineer<BR/>--permission-mode bypassPermissions (cwd<BR/>INSIDE the worktree)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "beads" [
    likec4_id = "step-10:alt.01:when.01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>17</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">bd unclaim RECIPE-6</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "workernotdispatched" [
    likec4_id = "step-10:alt.01:when.02";
    style = "dotted";
    color = "#a51d1d";
    fontcolor = "#fffff3";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>18</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">ERROR reason=worker-not-dispatched</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "beads" [
    likec4_id = "step-10:alt.02:when.01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>19</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">log one line, move on — the loop polls<BR/>nothing, reaps nothing, merges nothing,<BR/>ends nothing</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
}`;case`workerToGate`:return`digraph {
  likec4_viewId = "workerToGate";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "engineer" [
    likec4_id = "workers.engineer";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">engineer</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the back-end worker —<BR/>business logic, endpoints, hooks,<BR/>types, error factories. Spawned s b<BR/>w, certified by respawn. Never<BR/>writes tests, JSX, or CSS.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "beads" [
    likec4_id = "beads";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">beads DB (bd)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fdffff">What it is: the beads issue<BR/>database — the loop's only runtime<BR/>input. None of the contract docs<BR/>are read at runtime; the graph<BR/>lives here.Verbs the tower uses: bd</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6B7280";
    fontcolor = "#ffffff";
    color = "#484f5c";
    penwidth = 2;
    shape = "cylinder";
  ];
  "hook" [
    likec4_id = "hook";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">hooks/worker-stop.sh — the Stop hook</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#b9ffff">What it is: the fail-closed<BR/>gatekeeper that fires when a worker<BR/>session stops.Steps:checks<BR/>$BO_DONE_FILE — no marker, no<BR/>commit, no push, no PR, no close</FONT></TD></TR></TABLE>>;
    margin = "0.389,0.223";
    width = 4.584;
    height = 2.5;
    fillcolor = "#0E7490";
    fontcolor = "#ceffff";
    color = "#00516b";
  ];
  "notdeclareddone" [
    likec4_id = "errors.notDeclaredDone";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=not-declared-done</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: the Stop hook fired but<BR/>$BO_DONE_FILE was never touched.<BR/>Fail-closed: no commit, no push, no<BR/>PR, no close. The ticket stays<BR/>claimed so its lease parks it off</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#DC2626";
    fontcolor = "#fffff3";
    color = "#ad0005";
  ];
  "reviewagent" [
    likec4_id = "workers.reviewAgent";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">review</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the reviewer — three<BR/>questions from first principles:<BR/>does the code do what its source of<BR/>truth demands, do the tests prove<BR/>it, is it simple and readable. Maps</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "origin" [
    likec4_id = "origin";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">origin — GitHub</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fdffff">What it is: the remote the tower<BR/>publishes to. main at the bottom,<BR/>one PR per branch above it:<BR/>feature/&lt;slug&gt; → PR → the epic<BR/>branch, epic/&lt;slug&gt; → PR → main.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6B7280";
    fontcolor = "#ffffff";
    color = "#484f5c";
    penwidth = 2;
    shape = "cylinder";
  ];
  "noprtarget" [
    likec4_id = "errors.noPrTarget";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=no-pr-target</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: the Stop hook found no<BR/>PR target the loop never handed<BR/>down — named for the target, since<BR/>pr now means the url.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#DC2626";
    fontcolor = "#fffff3";
    color = "#ad0005";
  ];
  "dispatcher" [
    likec4_id = "dispatcher";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">bo loop — the dispatcher</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ddf2ff">What it is: CLI/beads-loop.sh — the<BR/>one command (bo loop) that turns<BR/>beads tickets into background<BR/>workers.Steps it runs, one per<BR/>tick:reads the branches already at</FONT></TD></TR></TABLE>>;
    margin = "0.389,0.223";
    width = 4.584;
    height = 2.5;
    fillcolor = "#2563EB";
    fontcolor = "#f1ffff";
    color = "#0042c2";
  ];
  "testerunit" [
    likec4_id = "workers.testerUnit";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-unit</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the micro tier — one<BR/>back-end function alone; every<BR/>branch, boundary, empty/null,<BR/>error. Never a component (the UI is<BR/>proved by the composition tier).</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "human" [
    likec4_id = "human";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Human (Brodie)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fdffff">What it is: the only one who closes<BR/>gates. Workers leave their tickets<BR/>open and report in their final<BR/>message; the human reads the<BR/>report, verifies the branch, and</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6B7280";
    fontcolor = "#ffffff";
    color = "#484f5c";
  ];
  "feata" [
    likec4_id = "tower.epic.featA";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Feature — Add a Recipe (RECIPE-5)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the feature gate for<BR/>one complete user-facing flow: a<BR/>user writes a recipe and sees it in<BR/>the box. Human closes it once<BR/>feature-review is done.Branch:</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#D97706";
    fontcolor = "#ffffff";
    color = "#ac5300";
  ];
  "featb" [
    likec4_id = "tower.epic.featB";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Feature — Search the Box (RECIPE-11)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the feature gate for<BR/>one complete user-facing flow: a<BR/>user searches saved recipes by<BR/>title and ingredient. Human closes<BR/>it once its review is done.Branch:</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#D97706";
    fontcolor = "#ffffff";
    color = "#ac5300";
  ];
  "engineer" -> "beads" [
    likec4_id = "step-01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>0</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">bd heartbeat RECIPE-6 — keep the lease<BR/>alive</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "engineer" -> "beads" [
    likec4_id = "step-02";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">writes src/recipes/validate-recipe.ts in<BR/>the worktree — never commits, never<BR/>branches</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "engineer" -> "beads" [
    likec4_id = "step-03";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">final action: touch $BO_DONE_FILE — only<BR/>if the brief is genuinely complete</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "engineer" -> "hook" [
    likec4_id = "step-04";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Stop fires</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "hook" -> "notdeclareddone" [
    likec4_id = "step-05:alt.01:when.01";
    style = "dotted";
    color = "#a51d1d";
    fontcolor = "#fffff3";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">ERROR reason=not-declared-done —<BR/>fail-closed</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "beads" -> "hook" [
    likec4_id = "step-05:alt.01:when.02";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">RECIPE-6 stays claimed; RECIPE-7 chained<BR/>behind it waits</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "hook" -> "origin" [
    likec4_id = "step-05:alt.02:when.01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">commit RECIPE-6 onto feature/add-recipe,<BR/>push, open PR base epic/recipe-box —<BR/>once per branch, reused after</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "beads" -> "hook" [
    likec4_id = "step-05:alt.02:when.02";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>7</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">write metadata pr=… onto RECIPE-6, close<BR/>the task</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "hook" -> "noprtarget" [
    likec4_id = "step-05:alt.02:when.03:alt.01:when.01";
    style = "dotted";
    color = "#a51d1d";
    fontcolor = "#fffff3";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>8</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">ERROR reason=no-pr-target — named for<BR/>the target, since pr now means the url</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "hook" -> "dispatcher" [
    likec4_id = "step-05:alt.02:when.03:alt.02:when.01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>9</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">the line opens one ticket: RECIPE-7<BR/>becomes the frontier</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "testerunit" [
    likec4_id = "step-06";
    color = "#1c4ab0";
    fontcolor = "#f1ffff";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>10</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">AGENT[unit-tests] = tester-unit —<BR/>respawn means a fresh session of the<BR/>SAME agent re-checks inside the one<BR/>ticket</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "beads" -> "testerunit" [
    likec4_id = "step-07";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>11</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">covers every branch of validateRecipe<BR/>(framework-jest), commits onto<BR/>feature/add-recipe via the hook</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "reviewagent" -> "origin" [
    likec4_id = "step-08";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>12</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">feature-review: maps entry to exit,<BR/>trace logs, tests against the<BR/>instrumented code, findings as PR<BR/>comments</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "human" -> "feata" [
    likec4_id = "step-09";
    color = "#a35905";
    fontcolor = "#ffffff";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>13</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">reads the report, verifies the flow,<BR/>closes RECIPE-5 — only a human closes a<BR/>gate</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "human" -> "featb" [
    likec4_id = "step-10";
    color = "#a35905";
    fontcolor = "#ffffff";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>14</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">verify, close RECIPE-11</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
}`;case`epicTier`:return`digraph {
  likec4_viewId = "epicTier";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "dispatcher" [
    likec4_id = "dispatcher";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">bo loop — the dispatcher</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ddf2ff">What it is: CLI/beads-loop.sh — the<BR/>one command (bo loop) that turns<BR/>beads tickets into background<BR/>workers.Steps it runs, one per<BR/>tick:reads the branches already at</FONT></TD></TR></TABLE>>;
    margin = "0.389,0.223";
    width = 4.584;
    height = 2.5;
    fillcolor = "#2563EB";
    fontcolor = "#f1ffff";
    color = "#0042c2";
  ];
  "mergeagent" [
    likec4_id = "workers.mergeAgent";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">merge</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the epic-tier assembler<BR/>— reads the feature branches off<BR/>the feature gates, assembles them<BR/>onto the epic branch in its own<BR/>worktree, resolves the conflicts</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "origin" [
    likec4_id = "origin";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">origin — GitHub</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fdffff">What it is: the remote the tower<BR/>publishes to. main at the bottom,<BR/>one PR per branch above it:<BR/>feature/&lt;slug&gt; → PR → the epic<BR/>branch, epic/&lt;slug&gt; → PR → main.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6B7280";
    fontcolor = "#ffffff";
    color = "#484f5c";
    penwidth = 2;
    shape = "cylinder";
  ];
  "testere2e" [
    likec4_id = "workers.testerE2e";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-e2e</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the broad tier —<BR/>journeys across features on the<BR/>real stack; cross-feature state;<BR/>one success + one failure per<BR/>feature. Label epic-e2e-test, skill</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "reviewagent" [
    likec4_id = "workers.reviewAgent";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">review</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the reviewer — three<BR/>questions from first principles:<BR/>does the code do what its source of<BR/>truth demands, do the tests prove<BR/>it, is it simple and readable. Maps</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "human" [
    likec4_id = "human";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Human (Brodie)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fdffff">What it is: the only one who closes<BR/>gates. Workers leave their tickets<BR/>open and report in their final<BR/>message; the human reads the<BR/>report, verifies the branch, and</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6B7280";
    fontcolor = "#ffffff";
    color = "#484f5c";
  ];
  "epic" [
    likec4_id = "tower.epic";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Epic — Recipe Box (RECIPE-1)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the epic gate — the<BR/>"what"; the human closes it once,<BR/>after epic-review is done.Branch:<BR/>epic/recipe-box → PR → main (the<BR/>loop publishes it and writes pr as</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#D97706";
    fontcolor = "#ffffff";
    color = "#ac5300";
  ];
  "dispatcher" -> "mergeagent" [
    likec4_id = "step-01";
    color = "#1c4ab0";
    fontcolor = "#f1ffff";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>0</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">RECIPE-2 epic-merge-pr is on the<BR/>frontier — dispatched like any other<BR/>stamp</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "mergeagent" -> "origin" [
    likec4_id = "step-02";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">read the feature branches off the gates,<BR/>assemble onto epic/recipe-box, resolve<BR/>the conflicts, run the tests, report</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "testere2e" [
    likec4_id = "step-03";
    color = "#1c4ab0";
    fontcolor = "#f1ffff";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">RECIPE-3 epic-e2e-test — journeys on the<BR/>real stack</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dispatcher" -> "reviewagent" [
    likec4_id = "step-04";
    color = "#1c4ab0";
    fontcolor = "#f1ffff";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">RECIPE-4 epic-review — three questions<BR/>from first principles</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "human" -> "epic" [
    likec4_id = "step-05";
    color = "#a35905";
    fontcolor = "#ffffff";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">verify, close the epic gate — thumbs-up<BR/>on the merged PR into main</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
}`;case`stageBackends`:return`digraph {
  likec4_viewId = "stageBackends";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "TB";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.806;
  ranksep = 1.806;
  pad = 0.209;
  fontname = "Arial";
  newrank = true;
  clusterrank = "global";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "enga" [
    likec4_id = "worktreesRoot.wtA.engA";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">engineer</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the back-end worker —<BR/>business logic, endpoints, hooks,<BR/>types, error factories. Spawned s b<BR/>w, certified by respawn. Never<BR/>writes tests, JSX, or CSS.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "engb" [
    likec4_id = "worktreesRoot.wtB.engB";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">engineer</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the back-end worker —<BR/>business logic, endpoints, hooks,<BR/>types, error factories. Spawned s b<BR/>w, certified by respawn. Never<BR/>writes tests, JSX, or CSS.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "t_backenda" [
    likec4_id = "worktreesRoot.wtA.t_backendA";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">backend-logic (RECIPE-6)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>validateRecipe + saveRecipe — pure<BR/>functions<BR/>label:    backend-logic<BR/>agent: engineer</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_backendb" [
    likec4_id = "worktreesRoot.wtB.t_backendB";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">backend-logic (RECIPE-12)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>searchRecipes — pure filter over<BR/>the repository port<BR/>label:    backend-logic<BR/>agent: engineer</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  subgraph "cluster_wta" {
    likec4_id = "worktreesRoot.wtA";
    likec4_level = 0;
    likec4_depth = 1;
    fillcolor = "#0c513c";
    color = "#073c28";
    style = "filled";
    margin = 50;
    label = <<FONT POINT-SIZE="11" COLOR="#eeffffb3"><B>FEATURE+ADD-RECIPE → FEATURE/ADD-RECIPE</B></FONT>>;
    "enga";
    "t_backenda";
  }
  subgraph "cluster_wtb" {
    likec4_id = "worktreesRoot.wtB";
    likec4_level = 0;
    likec4_depth = 1;
    fillcolor = "#0c513c";
    color = "#073c28";
    style = "filled";
    margin = 50;
    label = <<FONT POINT-SIZE="11" COLOR="#eeffffb3"><B>FEATURE+SEARCH-RECIPES → FEATURE/SEARCH-RECIPES</B></FONT>>;
    "engb";
    "t_backendb";
  }
  subgraph {
    rank = "same";
    "enga";
    "engb";
  }
  "enga" -> "t_backenda" [
    likec4_id = "5nigv3";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — one commit</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "engb" -> "t_backendb" [
    likec4_id = "18qhejj";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — one commit</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
}`;case`stageUnits`:return`digraph {
  likec4_viewId = "stageUnits";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "TB";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.806;
  ranksep = 1.806;
  pad = 0.209;
  fontname = "Arial";
  newrank = true;
  clusterrank = "global";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "unita" [
    likec4_id = "worktreesRoot.wtA.unitA";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-unit</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the micro tier — one<BR/>back-end function alone; every<BR/>branch, boundary, empty/null,<BR/>error. Never a component (the UI is<BR/>proved by the composition tier).</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "unitb" [
    likec4_id = "worktreesRoot.wtB.unitB";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-unit</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the micro tier — one<BR/>back-end function alone; every<BR/>branch, boundary, empty/null,<BR/>error. Never a component (the UI is<BR/>proved by the composition tier).</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "t_unita" [
    likec4_id = "worktreesRoot.wtA.t_unitA";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">unit-tests (RECIPE-7)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>exhaustive coverage for<BR/>validateRecipe<BR/>label:    unit-tests<BR/>agent: tester-unit (respawn)</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_unitb" [
    likec4_id = "worktreesRoot.wtB.t_unitB";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">unit-tests (RECIPE-13)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>exhaustive coverage for<BR/>searchRecipes<BR/>label:    unit-tests<BR/>agent: tester-unit (respawn)</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  subgraph "cluster_wta" {
    likec4_id = "worktreesRoot.wtA";
    likec4_level = 0;
    likec4_depth = 1;
    fillcolor = "#0c513c";
    color = "#073c28";
    style = "filled";
    margin = 50;
    label = <<FONT POINT-SIZE="11" COLOR="#eeffffb3"><B>FEATURE+ADD-RECIPE → FEATURE/ADD-RECIPE</B></FONT>>;
    "unita";
    "t_unita";
  }
  subgraph "cluster_wtb" {
    likec4_id = "worktreesRoot.wtB";
    likec4_level = 0;
    likec4_depth = 1;
    fillcolor = "#0c513c";
    color = "#073c28";
    style = "filled";
    margin = 50;
    label = <<FONT POINT-SIZE="11" COLOR="#eeffffb3"><B>FEATURE+SEARCH-RECIPES → FEATURE/SEARCH-RECIPES</B></FONT>>;
    "unitb";
    "t_unitb";
  }
  subgraph {
    rank = "same";
    "unita";
    "unitb";
  }
  "unita" -> "t_unita" [
    likec4_id = "1s6npuf";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — test commit</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "unitb" -> "t_unitb" [
    likec4_id = "1m7ynmf";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — test commit</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
}`;case`stageFrontends`:return`digraph {
  likec4_viewId = "stageFrontends";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "TB";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.806;
  ranksep = 1.806;
  pad = 0.209;
  fontname = "Arial";
  newrank = true;
  clusterrank = "global";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "fea" [
    likec4_id = "worktreesRoot.wtA.feA";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">frontend</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the UI worker —<BR/>components, layout, styling, the<BR/>shared component system. Built<BR/>last, against functions already<BR/>proved. Label frontend-ui.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "feb" [
    likec4_id = "worktreesRoot.wtB.feB";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">frontend</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the UI worker —<BR/>components, layout, styling, the<BR/>shared component system. Built<BR/>last, against functions already<BR/>proved. Label frontend-ui.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "t_fronta" [
    likec4_id = "worktreesRoot.wtA.t_frontA";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">frontend-ui (RECIPE-8)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>RecipeForm + RecipeCard against<BR/>proved functions<BR/>label:    frontend-ui<BR/>agent: frontend</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_frontb" [
    likec4_id = "worktreesRoot.wtB.t_frontB";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">frontend-ui (RECIPE-14)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>SearchBar + live results list<BR/>label:    frontend-ui<BR/>agent: frontend<BR/>category: frontend-ux</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  subgraph "cluster_wta" {
    likec4_id = "worktreesRoot.wtA";
    likec4_level = 0;
    likec4_depth = 1;
    fillcolor = "#0c513c";
    color = "#073c28";
    style = "filled";
    margin = 50;
    label = <<FONT POINT-SIZE="11" COLOR="#eeffffb3"><B>FEATURE+ADD-RECIPE → FEATURE/ADD-RECIPE</B></FONT>>;
    "fea";
    "t_fronta";
  }
  subgraph "cluster_wtb" {
    likec4_id = "worktreesRoot.wtB";
    likec4_level = 0;
    likec4_depth = 1;
    fillcolor = "#0c513c";
    color = "#073c28";
    style = "filled";
    margin = 50;
    label = <<FONT POINT-SIZE="11" COLOR="#eeffffb3"><B>FEATURE+SEARCH-RECIPES → FEATURE/SEARCH-RECIPES</B></FONT>>;
    "feb";
    "t_frontb";
  }
  subgraph {
    rank = "same";
    "fea";
    "feb";
  }
  "fea" -> "t_fronta" [
    likec4_id = "1gre3dh";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — UI commit</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "feb" -> "t_frontb" [
    likec4_id = "amjpyt";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — UI commit</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
}`;case`stageFeatureTier`:return`digraph {
  likec4_viewId = "stageFeatureTier";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "TB";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.806;
  ranksep = 1.806;
  pad = 0.209;
  fontname = "Arial";
  newrank = true;
  clusterrank = "global";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "fta" [
    likec4_id = "worktreesRoot.wtA.ftA";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-feature</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the composition tier —<BR/>one feature's pieces proved wired;<BR/>its errors and successes surface.<BR/>Never re-runs the unit tier's<BR/>edge-case matrix. Label</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "reva" [
    likec4_id = "worktreesRoot.wtA.revA";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">review</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the reviewer — three<BR/>questions from first principles:<BR/>does the code do what its source of<BR/>truth demands, do the tests prove<BR/>it, is it simple and readable. Maps</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "ftb" [
    likec4_id = "worktreesRoot.wtB.ftB";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-feature</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the composition tier —<BR/>one feature's pieces proved wired;<BR/>its errors and successes surface.<BR/>Never re-runs the unit tier's<BR/>edge-case matrix. Label</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "revb" [
    likec4_id = "worktreesRoot.wtB.revB";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">review</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the reviewer — three<BR/>questions from first principles:<BR/>does the code do what its source of<BR/>truth demands, do the tests prove<BR/>it, is it simple and readable. Maps</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "t_ftesta" [
    likec4_id = "worktreesRoot.wtA.t_ftestA";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">feature-test (RECIPE-9)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the add-recipe pieces are wired<BR/>label:    feature-test<BR/>agent: tester-feature (respawn)<BR/>category: feature-test</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_ftestb" [
    likec4_id = "worktreesRoot.wtB.t_ftestB";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">feature-test (RECIPE-15)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the search pieces are wired<BR/>label:    feature-test<BR/>agent: tester-feature (respawn)<BR/>category: feature-test</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_freva" [
    likec4_id = "worktreesRoot.wtA.t_frevA";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">feature-review (RECIPE-10)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the three questions over<BR/>feature/add-recipe<BR/>label:    feature-review<BR/>agent: review (respawn)</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_frevb" [
    likec4_id = "worktreesRoot.wtB.t_frevB";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">feature-review (RECIPE-16)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the three questions over<BR/>feature/search-recipes<BR/>label:    feature-review<BR/>agent: review (respawn)</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  subgraph "cluster_wta" {
    likec4_id = "worktreesRoot.wtA";
    likec4_level = 0;
    likec4_depth = 1;
    fillcolor = "#0c513c";
    color = "#073c28";
    style = "filled";
    margin = 50;
    label = <<FONT POINT-SIZE="11" COLOR="#eeffffb3"><B>FEATURE+ADD-RECIPE → FEATURE/ADD-RECIPE</B></FONT>>;
    "fta";
    "reva";
    "t_ftesta";
    "t_freva";
  }
  subgraph "cluster_wtb" {
    likec4_id = "worktreesRoot.wtB";
    likec4_level = 0;
    likec4_depth = 1;
    fillcolor = "#0c513c";
    color = "#073c28";
    style = "filled";
    margin = 50;
    label = <<FONT POINT-SIZE="11" COLOR="#eeffffb3"><B>FEATURE+SEARCH-RECIPES → FEATURE/SEARCH-RECIPES</B></FONT>>;
    "ftb";
    "revb";
    "t_ftestb";
    "t_frevb";
  }
  subgraph {
    rank = "same";
    "fta";
    "ftb";
  }
  subgraph {
    rank = "same";
    "reva";
    "revb";
  }
  "fta" -> "t_ftesta" [
    likec4_id = "1725ahh";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — suite</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "t_ftesta" -> "t_freva" [
    likec4_id = "1gx3td7";
    style = "dashed";
    color = "#505660";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "reva" -> "t_freva" [
    likec4_id = "zzqsa9";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — PR comments</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "ftb" -> "t_ftestb" [
    likec4_id = "1as68ad";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — suite</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "t_ftestb" -> "t_frevb" [
    likec4_id = "ycxpvv";
    style = "dashed";
    color = "#505660";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "revb" -> "t_frevb" [
    likec4_id = "1976vip";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — PR comments</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
}`;case`stageEpicTier`:return`digraph {
  likec4_viewId = "stageEpicTier";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "TB";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.806;
  ranksep = 1.806;
  pad = 0.209;
  fontname = "Arial";
  newrank = true;
  clusterrank = "global";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "mergerun" [
    likec4_id = "worktreesRoot.wtEpic.mergeRun";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">merge</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the epic-tier assembler<BR/>— reads the feature branches off<BR/>the feature gates, assembles them<BR/>onto the epic branch in its own<BR/>worktree, resolves the conflicts</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "e2erun" [
    likec4_id = "worktreesRoot.wtEpic.e2eRun";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">tester-e2e</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#ffffff">Flask</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the broad tier —<BR/>journeys across features on the<BR/>real stack; cross-feature state;<BR/>one success + one failure per<BR/>feature. Label epic-e2e-test, skill</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "epicreviewrun" [
    likec4_id = "worktreesRoot.wtEpic.epicReviewRun";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">review</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ffffff">What it is: the reviewer — three<BR/>questions from first principles:<BR/>does the code do what its source of<BR/>truth demands, do the tests prove<BR/>it, is it simple and readable. Maps</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#7C3AED";
    fontcolor = "#ffffff";
    color = "#4e0cc3";
  ];
  "t_merge" [
    likec4_id = "worktreesRoot.wtEpic.t_merge";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">epic-merge-pr (RECIPE-2)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>assemble the feature branches onto<BR/>epic/recipe-box<BR/>label:    epic-merge-pr<BR/>agent: merge</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_e2e" [
    likec4_id = "worktreesRoot.wtEpic.t_e2e";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">epic-e2e-test (RECIPE-3)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>journeys across the whole app in a<BR/>real browser<BR/>label:    epic-e2e-test<BR/>agent: tester-e2e (respawn)</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "t_epicreview" [
    likec4_id = "worktreesRoot.wtEpic.t_epicReview";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">epic-review (RECIPE-4)</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f6ffff">What's inside the ticket:title:<BR/>the three questions over the whole<BR/>epic<BR/>label:    epic-review<BR/>agent: review (respawn)</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748B";
    fontcolor = "#ffffff";
    color = "#415167";
  ];
  "mergerun" -> "t_merge" [
    likec4_id = "1l95cu";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — assemble</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "e2erun" -> "t_e2e" [
    likec4_id = "qowy8u";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — journeys</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "t_merge" -> "t_e2e" [
    likec4_id = "1db3fxy";
    style = "dashed";
    color = "#505660";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "epicreviewrun" -> "t_epicreview" [
    likec4_id = "1o87wvy";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">works — PR comments</FONT></TD></TR></TABLE>>;
    color = "#5d2cb2";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
  "t_e2e" -> "t_epicreview" [
    likec4_id = "1onrhhn";
    style = "dashed";
    color = "#505660";
    fontcolor = "#ffffff";
    arrowhead = "normal";
  ];
}`;case`errorMap`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=errorMap,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    subgraph cluster_errors {
        graph [color="#2d333d",
            fillcolor="#3e4651",
            label=<<FONT POINT-SIZE="11" COLOR="#cbd5e1b3"><B>THE ALARM VOCABULARY</B></FONT>>,
            likec4_depth=1,
            likec4_id=errors,
            likec4_level=0,
            margin=40,
            style=filled
        ];
        labelambiguous [color="#ad0005",
            fillcolor="#DC2626",
            fontcolor="#fffff3",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=label-ambiguous</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: zero or two dispatching<BR/>labels on a claim. The dispatcher<BR/>never guesses a specialist — the<BR/>ticket is LEFT CLAIMED so its lease<BR/>parks it off the frontier, and the</FONT></TD></TR></TABLE>>,
            likec4_id="errors.labelAmbiguous",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        metadatamissing [color="#ad0005",
            fillcolor="#DC2626",
            fontcolor="#fffff3",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=metadata-missing</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: no branch in the<BR/>claim's metadata — a plan agent<BR/>skipped its one key. Left claimed,<BR/>same treatment as a mislabelled<BR/>ticket. The loop never invents a</FONT></TD></TR></TABLE>>,
            likec4_id="errors.metadataMissing",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        branchbusy [color="#ad0005",
            fillcolor="#DC2626",
            fontcolor="#fffff3",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=branch_busy held=N</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: tickets exist and are<BR/>claimable, but every branch they<BR/>want is already working. The<BR/>freshly claimed ticket goes<BR/>straight back (bd unclaim) and the</FONT></TD></TR></TABLE>>,
            likec4_id="errors.branchBusy",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        worktreefailed [color="#ad0005",
            fillcolor="#DC2626",
            fontcolor="#fffff3",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=worktree-failed</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: git worktree add failed<BR/>under .claude/worktrees/. Left<BR/>claimed — a worker spawned in a<BR/>missing folder burns a slot on<BR/>nothing.</FONT></TD></TR></TABLE>>,
            likec4_id="errors.worktreeFailed",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        workernotdispatched [color="#ad0005",
            fillcolor="#DC2626",
            fontcolor="#fffff3",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=worker-not-dispatched</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: claude --bg spawned no<BR/>session. The ticket is put back<BR/>with bd unclaim so the next tick<BR/>can retry it.</FONT></TD></TR></TABLE>>,
            likec4_id="errors.workerNotDispatched",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        epicprfailed [color="#ad0005",
            fillcolor="#DC2626",
            fontcolor="#fffff3",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=epic-pr-failed step=…</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: the epic branch or its<BR/>PR could not be published. Steps:<BR/>walk, gate-branch, forge,<BR/>missing-tool, push, pr, annotate.<BR/>Left claimed — a worker spawned</FONT></TD></TR></TABLE>>,
            likec4_id="errors.epicPrFailed",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        frontierempty [color="#ad0005",
            fillcolor="#DC2626",
            fontcolor="#fffff3",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">reason=frontier_empty</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: the empty frontier's<BR/>first state — nothing left to do.</FONT></TD></TR></TABLE>>,
            likec4_id="errors.frontierEmpty",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        towerstalled [color="#ad0005",
            fillcolor="#DC2626",
            fontcolor="#fffff3",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">reason=tower_stalled waiting=N</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: the empty frontier's<BR/>second state — work exists but sits<BR/>off the frontier behind an open<BR/>blocker, an open gate most often,<BR/>which only a human can clear.</FONT></TD></TR></TABLE>>,
            likec4_id="errors.towerStalled",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        maxparallelstalled [color="#ad0005",
            fillcolor="#DC2626",
            fontcolor="#fffff3",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">max_parallel_stalled</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: at capacity (counted<BR/>fresh each tick from claude agents<BR/>--json) with nothing in_progress.</FONT></TD></TR></TABLE>>,
            likec4_id="errors.maxParallelStalled",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        notdeclareddone [color="#ad0005",
            fillcolor="#DC2626",
            fontcolor="#fffff3",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=not-declared-done</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: the Stop hook fired but<BR/>$BO_DONE_FILE was never touched.<BR/>Fail-closed: no commit, no push, no<BR/>PR, no close. The ticket stays<BR/>claimed so its lease parks it off</FONT></TD></TR></TABLE>>,
            likec4_id="errors.notDeclaredDone",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
        noprtarget [color="#ad0005",
            fillcolor="#DC2626",
            fontcolor="#fffff3",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">ERROR reason=no-pr-target</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#fffade">What it is: the Stop hook found no<BR/>PR target the loop never handed<BR/>down — named for the target, since<BR/>pr now means the url.</FONT></TD></TR></TABLE>>,
            likec4_id="errors.noPrTarget",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
    }
    dispatcher [color="#0042c2",
        fillcolor="#2563EB",
        fontcolor="#f1ffff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">bo loop — the dispatcher</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#ddf2ff">What it is: CLI/beads-loop.sh — the<BR/>one command (bo loop) that turns<BR/>beads tickets into background<BR/>workers.Steps it runs, one per<BR/>tick:reads the branches already at</FONT></TD></TR></TABLE>>,
        likec4_id=dispatcher,
        likec4_level=0,
        margin="0.389,0.223",
        width=4.584];
    dispatcher -> labelambiguous [arrowhead=normal,
        color="#a51d1d",
        fontcolor="#fffff3",
        likec4_id="1klgyqa",
        minlen=1,
        style=dotted];
    dispatcher -> metadatamissing [arrowhead=normal,
        color="#a51d1d",
        fontcolor="#fffff3",
        likec4_id="1uko40x",
        minlen=1,
        style=dotted];
    dispatcher -> branchbusy [arrowhead=normal,
        color="#a51d1d",
        fontcolor="#fffff3",
        likec4_id="13v8b8h",
        minlen=1,
        style=dotted];
    dispatcher -> worktreefailed [arrowhead=normal,
        color="#a51d1d",
        fontcolor="#fffff3",
        likec4_id=e6rdjg,
        minlen=1,
        style=dotted];
    dispatcher -> workernotdispatched [arrowhead=normal,
        color="#a51d1d",
        fontcolor="#fffff3",
        likec4_id="1asiut6",
        minlen=1,
        style=dotted];
    dispatcher -> epicprfailed [arrowhead=normal,
        color="#a51d1d",
        fontcolor="#fffff3",
        likec4_id=sba1bq,
        minlen=1,
        style=dotted];
    dispatcher -> frontierempty [arrowhead=normal,
        color="#a51d1d",
        fontcolor="#fffff3",
        likec4_id="16mpusi",
        minlen=1,
        style=dotted];
    dispatcher -> towerstalled [arrowhead=normal,
        color="#a51d1d",
        fontcolor="#fffff3",
        likec4_id="7agjbo",
        minlen=1,
        style=dotted];
    dispatcher -> maxparallelstalled [arrowhead=normal,
        color="#a51d1d",
        fontcolor="#fffff3",
        likec4_id="1jfdkhc",
        minlen=1,
        style=dotted];
    hook [color="#00516b",
        fillcolor="#0E7490",
        fontcolor="#ceffff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">hooks/worker-stop.sh — the Stop hook</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#b9ffff">What it is: the fail-closed<BR/>gatekeeper that fires when a worker<BR/>session stops.Steps:checks<BR/>$BO_DONE_FILE — no marker, no<BR/>commit, no push, no PR, no close</FONT></TD></TR></TABLE>>,
        likec4_id=hook,
        likec4_level=0,
        margin="0.389,0.223",
        width=4.584];
    hook -> notdeclareddone [arrowhead=normal,
        color="#a51d1d",
        fontcolor="#fffff3",
        likec4_id=yuwrmt,
        minlen=1,
        style=dotted];
    hook -> noprtarget [arrowhead=normal,
        color="#a51d1d",
        fontcolor="#fffff3",
        likec4_id="16w5zwe",
        minlen=1,
        style=dotted];
}
`;default:throw Error(`Unknown viewId: `+e)}},t=e=>{switch(e){case`index`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 16.1.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="6634pt" height="1008pt"
 viewBox="0.00 0.00 6634.00 1008.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 993.05)">
<g id="clust1" class="cluster">
<title>cluster_workers</title>
<polygon fill="#3e4651" stroke="#2d333d" points="512,-426 512,-707.2 3711,-707.2 3711,-426 512,-426"/>
<text xml:space="preserve" text-anchor="start" x="520" y="-694.3" font-family="Arial" font-weight="bold" font-size="11.00" fill="#cbd5e1" fill-opacity="0.701961">THE WORKERS (THE SPOKES)</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_errors</title>
<polygon fill="#3e4651" stroke="#2d333d" points="4147,-426 4147,-707.2 5083,-707.2 5083,-426 4147,-426"/>
<text xml:space="preserve" text-anchor="start" x="4155" y="-694.3" font-family="Arial" font-weight="bold" font-size="11.00" fill="#cbd5e1" fill-opacity="0.701961">THE ALARM VOCABULARY</text>
</g>
<g id="clust3" class="cluster">
<title>cluster_tower</title>
<polygon fill="#3a404a" stroke="#292f37" points="8,-8 8,-358.4 504,-358.4 504,-8 8,-8"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-345.5" font-family="Arial" font-weight="bold" font-size="11.00" fill="#cbd5e1" fill-opacity="0.701961">THE TOWER (ONE BEADS DB)</text>
</g>
<g id="clust4" class="cluster">
<title>cluster_feata</title>
<polygon fill="#764610" stroke="#5d320a" points="40,-40 40,-305.2 472,-305.2 472,-40 40,-40"/>
<text xml:space="preserve" text-anchor="start" x="48" y="-292.3" font-family="Arial" font-weight="bold" font-size="11.00" fill="#ffffff" fill-opacity="0.701961">FEATURE — ADD A RECIPE (RECIPE&#45;5)</text>
</g>
<!-- engineer -->
<g id="node1" class="node">
<title>engineer</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="907.95,-646 552.05,-646 552.05,-466 907.95,-466 907.95,-646"/>
<text xml:space="preserve" text-anchor="start" x="600.17" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="644.11" y="-595" font-family="Arial" font-size="20.00" fill="#ffffff">engineer</text>
<text xml:space="preserve" text-anchor="start" x="885.94" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="644.11" y="-572" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the back&#45;end worker —</text>
<text xml:space="preserve" text-anchor="start" x="644.11" y="-554" font-family="Arial" font-size="15.00" fill="#ffffff">business logic, endpoints, hooks,</text>
<text xml:space="preserve" text-anchor="start" x="644.11" y="-536" font-family="Arial" font-size="15.00" fill="#ffffff">types, error factories. Spawned s b</text>
<text xml:space="preserve" text-anchor="start" x="644.11" y="-518" font-family="Arial" font-size="15.00" fill="#ffffff">w, certified by respawn. Never</text>
<text xml:space="preserve" text-anchor="start" x="644.11" y="-500" font-family="Arial" font-size="15.00" fill="#ffffff">writes tests, JSX, or CSS.</text>
</g>
<!-- testerunit -->
<g id="node2" class="node">
<title>testerunit</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="1377.61,-646 1018.39,-646 1018.39,-466 1377.61,-466 1377.61,-646"/>
<text xml:space="preserve" text-anchor="start" x="1066.51" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1110.45" y="-604.8" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;unit</text>
<text xml:space="preserve" text-anchor="start" x="1355.6" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1110.45" y="-583.8" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="1110.45" y="-562.2" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the micro tier — one</text>
<text xml:space="preserve" text-anchor="start" x="1110.45" y="-544.2" font-family="Arial" font-size="15.00" fill="#ffffff">back&#45;end function alone; every</text>
<text xml:space="preserve" text-anchor="start" x="1110.45" y="-526.2" font-family="Arial" font-size="15.00" fill="#ffffff">branch, boundary, empty/null,</text>
<text xml:space="preserve" text-anchor="start" x="1110.45" y="-508.2" font-family="Arial" font-size="15.00" fill="#ffffff">error. Never a component (the UI is</text>
<text xml:space="preserve" text-anchor="start" x="1110.45" y="-490.2" font-family="Arial" font-size="15.00" fill="#ffffff">proved by the composition tier).</text>
</g>
<!-- frontend -->
<g id="node3" class="node">
<title>frontend</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="1824.78,-646 1487.22,-646 1487.22,-466 1824.78,-466 1824.78,-646"/>
<text xml:space="preserve" text-anchor="start" x="1535.34" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1579.28" y="-595" font-family="Arial" font-size="20.00" fill="#ffffff">frontend</text>
<text xml:space="preserve" text-anchor="start" x="1802.77" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1579.28" y="-572" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the UI worker —</text>
<text xml:space="preserve" text-anchor="start" x="1579.28" y="-554" font-family="Arial" font-size="15.00" fill="#ffffff">components, layout, styling, the</text>
<text xml:space="preserve" text-anchor="start" x="1579.28" y="-536" font-family="Arial" font-size="15.00" fill="#ffffff">shared component system. Built</text>
<text xml:space="preserve" text-anchor="start" x="1579.28" y="-518" font-family="Arial" font-size="15.00" fill="#ffffff">last, against functions already</text>
<text xml:space="preserve" text-anchor="start" x="1579.28" y="-500" font-family="Arial" font-size="15.00" fill="#ffffff">proved. Label frontend&#45;ui.</text>
</g>
<!-- testerfeature -->
<g id="node4" class="node">
<title>testerfeature</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="2287.06,-646 1934.94,-646 1934.94,-466 2287.06,-466 2287.06,-646"/>
<text xml:space="preserve" text-anchor="start" x="1983.06" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2027" y="-604.8" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;feature</text>
<text xml:space="preserve" text-anchor="start" x="2265.05" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2027" y="-583.8" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="2027" y="-562.2" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the composition tier —</text>
<text xml:space="preserve" text-anchor="start" x="2027" y="-544.2" font-family="Arial" font-size="15.00" fill="#ffffff">one feature&#39;s pieces proved wired;</text>
<text xml:space="preserve" text-anchor="start" x="2027" y="-526.2" font-family="Arial" font-size="15.00" fill="#ffffff">its errors and successes surface.</text>
<text xml:space="preserve" text-anchor="start" x="2027" y="-508.2" font-family="Arial" font-size="15.00" fill="#ffffff">Never re&#45;runs the unit tier&#39;s</text>
<text xml:space="preserve" text-anchor="start" x="2027" y="-490.2" font-family="Arial" font-size="15.00" fill="#ffffff">edge&#45;case matrix. Label</text>
</g>
<!-- testere2e -->
<g id="node5" class="node">
<title>testere2e</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="2737.04,-646 2396.96,-646 2396.96,-466 2737.04,-466 2737.04,-646"/>
<text xml:space="preserve" text-anchor="start" x="2445.08" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2489.03" y="-604.8" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;e2e</text>
<text xml:space="preserve" text-anchor="start" x="2715.03" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2489.03" y="-583.8" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="2489.03" y="-562.2" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the broad tier —</text>
<text xml:space="preserve" text-anchor="start" x="2489.03" y="-544.2" font-family="Arial" font-size="15.00" fill="#ffffff">journeys across features on the</text>
<text xml:space="preserve" text-anchor="start" x="2489.03" y="-526.2" font-family="Arial" font-size="15.00" fill="#ffffff">real stack; cross&#45;feature state;</text>
<text xml:space="preserve" text-anchor="start" x="2489.03" y="-508.2" font-family="Arial" font-size="15.00" fill="#ffffff">one success + one failure per</text>
<text xml:space="preserve" text-anchor="start" x="2489.03" y="-490.2" font-family="Arial" font-size="15.00" fill="#ffffff">feature. Label epic&#45;e2e&#45;test, skill</text>
</g>
<!-- reviewagent -->
<g id="node6" class="node">
<title>reviewagent</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="3207.05,-646 2846.95,-646 2846.95,-466 3207.05,-466 3207.05,-646"/>
<text xml:space="preserve" text-anchor="start" x="2895.07" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2939.01" y="-595" font-family="Arial" font-size="20.00" fill="#ffffff">review</text>
<text xml:space="preserve" text-anchor="start" x="3185.04" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2939.01" y="-572" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the reviewer — three</text>
<text xml:space="preserve" text-anchor="start" x="2939.01" y="-554" font-family="Arial" font-size="15.00" fill="#ffffff">questions from first principles:</text>
<text xml:space="preserve" text-anchor="start" x="2939.01" y="-536" font-family="Arial" font-size="15.00" fill="#ffffff">does the code do what its source of</text>
<text xml:space="preserve" text-anchor="start" x="2939.01" y="-518" font-family="Arial" font-size="15.00" fill="#ffffff">truth demands, do the tests prove</text>
<text xml:space="preserve" text-anchor="start" x="2939.01" y="-500" font-family="Arial" font-size="15.00" fill="#ffffff">it, is it simple and readable. Maps</text>
</g>
<!-- mergeagent -->
<g id="node7" class="node">
<title>mergeagent</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="3671.13,-646 3316.87,-646 3316.87,-466 3671.13,-466 3671.13,-646"/>
<text xml:space="preserve" text-anchor="start" x="3364.99" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="3408.94" y="-595" font-family="Arial" font-size="20.00" fill="#ffffff">merge</text>
<text xml:space="preserve" text-anchor="start" x="3649.12" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="3408.94" y="-572" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the epic&#45;tier assembler</text>
<text xml:space="preserve" text-anchor="start" x="3408.94" y="-554" font-family="Arial" font-size="15.00" fill="#ffffff">— reads the feature branches off</text>
<text xml:space="preserve" text-anchor="start" x="3408.94" y="-536" font-family="Arial" font-size="15.00" fill="#ffffff">the feature gates, assembles them</text>
<text xml:space="preserve" text-anchor="start" x="3408.94" y="-518" font-family="Arial" font-size="15.00" fill="#ffffff">onto the epic branch in its own</text>
<text xml:space="preserve" text-anchor="start" x="3408.94" y="-500" font-family="Arial" font-size="15.00" fill="#ffffff">worktree, resolves the conflicts</text>
</g>
<!-- labelambiguous -->
<g id="node8" class="node">
<title>labelambiguous</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="5042.75,-646 4621.25,-646 4621.25,-466 5042.75,-466 5042.75,-646"/>
<text xml:space="preserve" text-anchor="start" x="4669.37" y="-550.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="4713.31" y="-595" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=label&#45;ambiguous</text>
<text xml:space="preserve" text-anchor="start" x="5020.74" y="-550.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="4713.31" y="-572" font-family="Arial" font-size="15.00" fill="#fffade">What it is: zero or two dispatching</text>
<text xml:space="preserve" text-anchor="start" x="4713.31" y="-554" font-family="Arial" font-size="15.00" fill="#fffade">labels on a claim. The dispatcher</text>
<text xml:space="preserve" text-anchor="start" x="4713.31" y="-536" font-family="Arial" font-size="15.00" fill="#fffade">never guesses a specialist — the</text>
<text xml:space="preserve" text-anchor="start" x="4713.31" y="-518" font-family="Arial" font-size="15.00" fill="#fffade">ticket is LEFT CLAIMED so its lease</text>
<text xml:space="preserve" text-anchor="start" x="4713.31" y="-500" font-family="Arial" font-size="15.00" fill="#fffade">parks it off the frontier, and the</text>
</g>
<!-- frontierempty -->
<g id="node9" class="node">
<title>frontierempty</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="4511.4,-646 4186.6,-646 4186.6,-466 4511.4,-466 4511.4,-646"/>
<text xml:space="preserve" text-anchor="start" x="4234.72" y="-550.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="4278.67" y="-568" font-family="Arial" font-size="20.00" fill="#fffff3">reason=frontier_empty</text>
<text xml:space="preserve" text-anchor="start" x="4489.39" y="-550.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="4278.67" y="-545" font-family="Arial" font-size="15.00" fill="#fffade">What it is: the empty frontier&#39;s</text>
<text xml:space="preserve" text-anchor="start" x="4278.67" y="-527" font-family="Arial" font-size="15.00" fill="#fffade">first state — nothing left to do.</text>
</g>
<!-- backenda -->
<g id="node10" class="node">
<title>backenda</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="440.43,-252 71.57,-252 71.57,-72 440.43,-72 440.43,-252"/>
<text xml:space="preserve" text-anchor="start" x="119.69" y="-156.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="163.64" y="-201" font-family="Arial" font-size="20.00" fill="#ffffff">backend&#45;logic (RECIPE&#45;6)</text>
<text xml:space="preserve" text-anchor="start" x="418.42" y="-156.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="163.64" y="-178" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="163.64" y="-160" font-family="Arial" font-size="15.00" fill="#f6ffff">validateRecipe + saveRecipe — pure</text>
<text xml:space="preserve" text-anchor="start" x="163.64" y="-142" font-family="Arial" font-size="15.00" fill="#f6ffff">functions</text>
<text xml:space="preserve" text-anchor="start" x="163.64" y="-124" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;backend&#45;logic</text>
<text xml:space="preserve" text-anchor="start" x="163.64" y="-106" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: engineer</text>
</g>
<!-- dispatcher -->
<g id="node11" class="node">
<title>dispatcher</title>
<polygon fill="#2563eb" stroke="#0042c2" stroke-width="0" points="3103.73,-978 2706.27,-978 2706.27,-798 3103.73,-798 3103.73,-978"/>
<text xml:space="preserve" text-anchor="start" x="2774.33" y="-882.4" font-family="Arial" font-size="14.00" fill="#f1ffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2818.28" y="-927" font-family="Arial" font-size="20.00" fill="#f1ffff">bo loop — the dispatcher</text>
<text xml:space="preserve" text-anchor="start" x="3061.78" y="-882.4" font-family="Arial" font-size="14.00" fill="#f1ffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2818.28" y="-904" font-family="Arial" font-size="15.00" fill="#ddf2ff">What it is: CLI/beads&#45;loop.sh — the</text>
<text xml:space="preserve" text-anchor="start" x="2818.28" y="-886" font-family="Arial" font-size="15.00" fill="#ddf2ff">one command (bo loop) that turns</text>
<text xml:space="preserve" text-anchor="start" x="2818.28" y="-868" font-family="Arial" font-size="15.00" fill="#ddf2ff">beads tickets into background</text>
<text xml:space="preserve" text-anchor="start" x="2818.28" y="-850" font-family="Arial" font-size="15.00" fill="#ddf2ff">workers.Steps it runs, one per</text>
<text xml:space="preserve" text-anchor="start" x="2818.28" y="-832" font-family="Arial" font-size="15.00" fill="#ddf2ff">tick:reads the branches already at</text>
</g>
<!-- beads -->
<g id="node12" class="node">
<title>beads</title>
<path fill="#6b7280" stroke="#484f5c" stroke-width="2" d="M909.21,-235.64C909.21,-244.67 828.88,-252 730,-252 631.12,-252 550.79,-244.67 550.79,-235.64 550.79,-235.64 550.79,-88.36 550.79,-88.36 550.79,-79.33 631.12,-72 730,-72 828.88,-72 909.21,-79.33 909.21,-88.36 909.21,-88.36 909.21,-235.64 909.21,-235.64"/>
<path fill="none" stroke="#484f5c" stroke-width="2" d="M909.21,-235.64C909.21,-226.61 828.88,-219.27 730,-219.27 631.12,-219.27 550.79,-226.61 550.79,-235.64"/>
<text xml:space="preserve" text-anchor="start" x="598.91" y="-156.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="642.86" y="-201" font-family="Arial" font-size="20.00" fill="#ffffff">beads DB (bd)</text>
<text xml:space="preserve" text-anchor="start" x="887.2" y="-156.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="642.86" y="-178" font-family="Arial" font-size="15.00" fill="#fdffff">What it is: the beads issue</text>
<text xml:space="preserve" text-anchor="start" x="642.86" y="-160" font-family="Arial" font-size="15.00" fill="#fdffff">database — the loop&#39;s only runtime</text>
<text xml:space="preserve" text-anchor="start" x="642.86" y="-142" font-family="Arial" font-size="15.00" fill="#fdffff">input. None of the contract docs</text>
<text xml:space="preserve" text-anchor="start" x="642.86" y="-124" font-family="Arial" font-size="15.00" fill="#fdffff">are read at runtime; the graph</text>
<text xml:space="preserve" text-anchor="start" x="642.86" y="-106" font-family="Arial" font-size="15.00" fill="#fdffff">lives here.Verbs the tower uses: bd</text>
</g>
<!-- origin -->
<g id="node13" class="node">
<title>origin</title>
<path fill="#6b7280" stroke="#484f5c" stroke-width="2" d="M3969.12,-235.64C3969.12,-244.67 3889.73,-252 3792,-252 3694.27,-252 3614.88,-244.67 3614.88,-235.64 3614.88,-235.64 3614.88,-88.36 3614.88,-88.36 3614.88,-79.33 3694.27,-72 3792,-72 3889.73,-72 3969.12,-79.33 3969.12,-88.36 3969.12,-88.36 3969.12,-235.64 3969.12,-235.64"/>
<path fill="none" stroke="#484f5c" stroke-width="2" d="M3969.12,-235.64C3969.12,-226.61 3889.73,-219.27 3792,-219.27 3694.27,-219.27 3614.88,-226.61 3614.88,-235.64"/>
<text xml:space="preserve" text-anchor="start" x="3663" y="-156.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="3706.94" y="-201" font-family="Arial" font-size="20.00" fill="#ffffff">origin — GitHub</text>
<text xml:space="preserve" text-anchor="start" x="3947.11" y="-156.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="3706.94" y="-178" font-family="Arial" font-size="15.00" fill="#fdffff">What it is: the remote the tower</text>
<text xml:space="preserve" text-anchor="start" x="3706.94" y="-160" font-family="Arial" font-size="15.00" fill="#fdffff">publishes to. main at the bottom,</text>
<text xml:space="preserve" text-anchor="start" x="3706.94" y="-142" font-family="Arial" font-size="15.00" fill="#fdffff">one PR per branch above it:</text>
<text xml:space="preserve" text-anchor="start" x="3706.94" y="-124" font-family="Arial" font-size="15.00" fill="#fdffff">feature/&lt;slug&gt; → PR → the epic</text>
<text xml:space="preserve" text-anchor="start" x="3706.94" y="-106" font-family="Arial" font-size="15.00" fill="#fdffff">branch, epic/&lt;slug&gt; → PR → main.</text>
</g>
<!-- hook -->
<g id="node14" class="node">
<title>hook</title>
<polygon fill="#0e7490" stroke="#00516b" stroke-width="0" points="6128.65,-646 5623.35,-646 5623.35,-466 6128.65,-466 6128.65,-646"/>
<text xml:space="preserve" text-anchor="start" x="5691.41" y="-550.4" font-family="Arial" font-size="14.00" fill="#ceffff"> </text>
<text xml:space="preserve" text-anchor="start" x="5735.36" y="-595" font-family="Arial" font-size="20.00" fill="#ceffff">hooks/worker&#45;stop.sh — the Stop hook</text>
<text xml:space="preserve" text-anchor="start" x="6086.7" y="-550.4" font-family="Arial" font-size="14.00" fill="#ceffff"> </text>
<text xml:space="preserve" text-anchor="start" x="5735.36" y="-572" font-family="Arial" font-size="15.00" fill="#b9ffff">What it is: the fail&#45;closed</text>
<text xml:space="preserve" text-anchor="start" x="5735.36" y="-554" font-family="Arial" font-size="15.00" fill="#b9ffff">gatekeeper that fires when a worker</text>
<text xml:space="preserve" text-anchor="start" x="5735.36" y="-536" font-family="Arial" font-size="15.00" fill="#b9ffff">session stops.Steps:checks</text>
<text xml:space="preserve" text-anchor="start" x="5735.36" y="-518" font-family="Arial" font-size="15.00" fill="#b9ffff">$BO_DONE_FILE — no marker, no</text>
<text xml:space="preserve" text-anchor="start" x="5735.36" y="-500" font-family="Arial" font-size="15.00" fill="#b9ffff">commit, no push, no PR, no close</text>
</g>
<!-- human -->
<g id="node15" class="node">
<title>human</title>
<polygon fill="#6b7280" stroke="#484f5c" stroke-width="0" points="433.12,-646 78.88,-646 78.88,-466 433.12,-466 433.12,-646"/>
<text xml:space="preserve" text-anchor="start" x="127" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="170.94" y="-595" font-family="Arial" font-size="20.00" fill="#ffffff">Human (Brodie)</text>
<text xml:space="preserve" text-anchor="start" x="411.11" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="170.94" y="-572" font-family="Arial" font-size="15.00" fill="#fdffff">What it is: the only one who closes</text>
<text xml:space="preserve" text-anchor="start" x="170.94" y="-554" font-family="Arial" font-size="15.00" fill="#fdffff">gates. Workers leave their tickets</text>
<text xml:space="preserve" text-anchor="start" x="170.94" y="-536" font-family="Arial" font-size="15.00" fill="#fdffff">open and report in their final</text>
<text xml:space="preserve" text-anchor="start" x="170.94" y="-518" font-family="Arial" font-size="15.00" fill="#fdffff">message; the human reads the</text>
<text xml:space="preserve" text-anchor="start" x="170.94" y="-500" font-family="Arial" font-size="15.00" fill="#fdffff">report, verifies the branch, and</text>
</g>
<!-- decisions -->
<g id="node16" class="node">
<title>decisions</title>
<polygon fill="#6b7280" stroke="#484f5c" stroke-width="0" points="6604.38,-978 6237.62,-978 6237.62,-798 6604.38,-798 6604.38,-978"/>
<text xml:space="preserve" text-anchor="start" x="6285.74" y="-882.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="6329.69" y="-927" font-family="Arial" font-size="20.00" fill="#ffffff">Decision points</text>
<text xml:space="preserve" text-anchor="start" x="6582.37" y="-882.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="6329.69" y="-904" font-family="Arial" font-size="15.00" fill="#fdffff">What it is: the judgments the</text>
<text xml:space="preserve" text-anchor="start" x="6329.69" y="-886" font-family="Arial" font-size="15.00" fill="#fdffff">machine cannot make — everything</text>
<text xml:space="preserve" text-anchor="start" x="6329.69" y="-868" font-family="Arial" font-size="15.00" fill="#fdffff">else is mechanical.Plan&#45;epic: what</text>
<text xml:space="preserve" text-anchor="start" x="6329.69" y="-850" font-family="Arial" font-size="15.00" fill="#fdffff">the epic is — one epic, one</text>
<text xml:space="preserve" text-anchor="start" x="6329.69" y="-832" font-family="Arial" font-size="15.00" fill="#fdffff">epic/&lt;slug&gt; of 2–4 lowercase words</text>
</g>
<!-- planepic -->
<g id="node17" class="node">
<title>planepic</title>
<polygon fill="#0891b2" stroke="#006c8c" stroke-width="0" points="6603.13,-646 6238.87,-646 6238.87,-466 6603.13,-466 6603.13,-646"/>
<text xml:space="preserve" text-anchor="start" x="6286.99" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="6330.94" y="-595" font-family="Arial" font-size="20.00" fill="#ffffff">plan&#45;epic</text>
<text xml:space="preserve" text-anchor="start" x="6581.12" y="-550.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="6330.94" y="-572" font-family="Arial" font-size="15.00" fill="#f9ffff">What it is: conversational epic</text>
<text xml:space="preserve" text-anchor="start" x="6330.94" y="-554" font-family="Arial" font-size="15.00" fill="#f9ffff">architect — vague idea → clarifying</text>
<text xml:space="preserve" text-anchor="start" x="6330.94" y="-536" font-family="Arial" font-size="15.00" fill="#f9ffff">questions → research → exactly one</text>
<text xml:space="preserve" text-anchor="start" x="6330.94" y="-518" font-family="Arial" font-size="15.00" fill="#f9ffff">epic gate plus epic&#45;merge&#45;pr,</text>
<text xml:space="preserve" text-anchor="start" x="6330.94" y="-500" font-family="Arial" font-size="15.00" fill="#f9ffff">epic&#45;e2e&#45;test, epic&#45;review. Writes</text>
</g>
<!-- engineer&#45;&gt;backenda -->
<g id="edge17" class="edge">
<title>engineer&#45;&gt;backenda</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M622.44,-466.05C547.58,-404.14 447.85,-321.66 371.34,-258.39"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="373.33,-256.62 365.87,-253.87 369.98,-260.67 373.33,-256.62"/>
</g>
<!-- engineer&#45;&gt;beads -->
<g id="edge15" class="edge">
<title>engineer&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M730,-466.05C730,-405.71 730,-325.84 730,-263.24"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="732.63,-263.48 730,-255.98 727.38,-263.48 732.63,-263.48"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="730,-374.8 730,-397.6 957.82,-397.6 957.82,-374.8 730,-374.8"/>
<text xml:space="preserve" text-anchor="start" x="733" y="-380.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">bd heartbeat — keep the lease alive</text>
</g>
<!-- engineer&#45;&gt;origin -->
<g id="edge16" class="edge">
<title>engineer&#45;&gt;origin</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M868.77,-466.08C898.84,-450.31 931.19,-435.81 963,-426 1459.46,-272.88 3054.43,-193.67 3603.89,-170.42"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="3603.89,-173.05 3611.27,-170.11 3603.66,-167.8 3603.89,-173.05"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1188.82,-366.4 1188.82,-406 1450.07,-406 1450.07,-366.4 1188.82,-366.4"/>
<text xml:space="preserve" text-anchor="start" x="1191.82" y="-389" font-family="Arial" font-size="14.00" fill="#c9c9c9">commit on the branch (via the Stop hook,</text>
<text xml:space="preserve" text-anchor="start" x="1191.82" y="-372.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">never directly)</text>
</g>
<!-- dispatcher&#45;&gt;engineer -->
<g id="edge1" class="edge">
<title>dispatcher&#45;&gt;engineer</title>
<path fill="none" stroke="#1c4ab0" stroke-width="2" stroke-dasharray="5,2" d="M2706.41,-880.58C2278.29,-864.81 1281.45,-817.15 963,-707.2 924.84,-694.02 886.66,-673.35 852.59,-651.52"/>
<polygon fill="#1c4ab0" stroke="#1c4ab0" stroke-width="2" points="854.27,-649.48 846.55,-647.59 851.41,-653.88 854.27,-649.48"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1048.29,-715.2 1048.29,-738 1140.68,-738 1140.68,-715.2 1048.29,-715.2"/>
<text xml:space="preserve" text-anchor="start" x="1051.29" y="-721" font-family="Arial" font-size="14.00" fill="#f1ffff">backend&#45;logic</text>
</g>
<!-- dispatcher&#45;&gt;testerunit -->
<g id="edge2" class="edge">
<title>dispatcher&#45;&gt;testerunit</title>
<path fill="none" stroke="#1c4ab0" stroke-width="2" stroke-dasharray="5,2" d="M2706.31,-873.76C2360.27,-848.89 1661.93,-790.11 1432,-707.2 1394.32,-693.61 1356.49,-673.06 1322.56,-651.48"/>
<polygon fill="#1c4ab0" stroke="#1c4ab0" stroke-width="2" points="1324.29,-649.47 1316.56,-647.61 1321.44,-653.88 1324.29,-649.47"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1521.79,-715.2 1521.79,-738 1584.59,-738 1584.59,-715.2 1521.79,-715.2"/>
<text xml:space="preserve" text-anchor="start" x="1524.79" y="-721" font-family="Arial" font-size="14.00" fill="#f1ffff">unit&#45;tests</text>
</g>
<!-- dispatcher&#45;&gt;frontend -->
<g id="edge3" class="edge">
<title>dispatcher&#45;&gt;frontend</title>
<path fill="none" stroke="#1c4ab0" stroke-width="2" stroke-dasharray="5,2" d="M2706.62,-876.61C2495.12,-860.02 2153.66,-817.19 1880,-707.2 1844.71,-693.01 1809.25,-672.71 1777.3,-651.59"/>
<polygon fill="#1c4ab0" stroke="#1c4ab0" stroke-width="2" points="1779.03,-649.59 1771.33,-647.6 1776.11,-653.95 1779.03,-649.59"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1958.88,-715.2 1958.88,-738 2031.81,-738 2031.81,-715.2 1958.88,-715.2"/>
<text xml:space="preserve" text-anchor="start" x="1961.88" y="-721" font-family="Arial" font-size="14.00" fill="#f1ffff">frontend&#45;ui</text>
</g>
<!-- dispatcher&#45;&gt;testerfeature -->
<g id="edge4" class="edge">
<title>dispatcher&#45;&gt;testerfeature</title>
<path fill="none" stroke="#1c4ab0" stroke-width="2" stroke-dasharray="5,2" d="M2706.29,-837.57C2596.2,-806.75 2458.47,-762.43 2342,-707.2 2308.81,-691.46 2274.75,-671.65 2243.33,-651.63"/>
<polygon fill="#1c4ab0" stroke="#1c4ab0" stroke-width="2" points="2244.82,-649.46 2237.09,-647.62 2241.98,-653.88 2244.82,-649.46"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2400.44,-715.2 2400.44,-738 2477.26,-738 2477.26,-715.2 2400.44,-715.2"/>
<text xml:space="preserve" text-anchor="start" x="2403.44" y="-721" font-family="Arial" font-size="14.00" fill="#f1ffff">feature&#45;test</text>
</g>
<!-- dispatcher&#45;&gt;testere2e -->
<g id="edge5" class="edge">
<title>dispatcher&#45;&gt;testere2e</title>
<path fill="none" stroke="#1c4ab0" stroke-width="2" stroke-dasharray="5,2" d="M2813.98,-798.13C2768.04,-753.28 2712.26,-698.82 2665.34,-653.02"/>
<polygon fill="#1c4ab0" stroke="#1c4ab0" stroke-width="2" points="2667.26,-651.22 2660.06,-647.86 2663.59,-654.97 2667.26,-651.22"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2746.13,-715.2 2746.13,-738 2833.07,-738 2833.07,-715.2 2746.13,-715.2"/>
<text xml:space="preserve" text-anchor="start" x="2749.13" y="-721" font-family="Arial" font-size="14.00" fill="#f1ffff">epic&#45;e2e&#45;test</text>
</g>
<!-- dispatcher&#45;&gt;reviewagent -->
<g id="edge6" class="edge">
<title>dispatcher&#45;&gt;reviewagent</title>
<path fill="none" stroke="#1c4ab0" stroke-width="2" stroke-dasharray="5,2" d="M2937.85,-798.13C2954.13,-754.11 2973.82,-700.84 2990.56,-655.57"/>
<polygon fill="#1c4ab0" stroke="#1c4ab0" stroke-width="2" points="2993,-656.52 2993.14,-648.58 2988.08,-654.7 2993,-656.52"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2966,-715.2 2966,-738 2992.99,-738 2992.99,-715.2 2966,-715.2"/>
<text xml:space="preserve" text-anchor="start" x="2969" y="-723.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#f1ffff">[...]</text>
</g>
<!-- dispatcher&#45;&gt;mergeagent -->
<g id="edge7" class="edge">
<title>dispatcher&#45;&gt;mergeagent</title>
<path fill="none" stroke="#1c4ab0" stroke-width="2" stroke-dasharray="5,2" d="M3090.92,-798.12C3146.6,-770.23 3207.36,-738.52 3262,-707.2 3292.03,-689.99 3323.55,-670.55 3353.34,-651.51"/>
<polygon fill="#1c4ab0" stroke="#1c4ab0" stroke-width="2" points="3354.67,-653.78 3359.56,-647.52 3351.83,-649.36 3354.67,-653.78"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="3243.29,-715.2 3243.29,-738 3336.43,-738 3336.43,-715.2 3243.29,-715.2"/>
<text xml:space="preserve" text-anchor="start" x="3246.29" y="-721" font-family="Arial" font-size="14.00" fill="#f1ffff">epic&#45;merge&#45;pr</text>
</g>
<!-- dispatcher&#45;&gt;labelambiguous -->
<g id="edge8" class="edge">
<title>dispatcher&#45;&gt;labelambiguous</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M3103.69,-875.57C3483.43,-852.07 4298.31,-793.22 4566,-707.2 4608.36,-693.59 4651.53,-672.76 4690.43,-650.92"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="4691.32,-653.43 4696.54,-647.44 4688.73,-648.86 4691.32,-653.43"/>
</g>
<!-- dispatcher&#45;&gt;frontierempty -->
<g id="edge9" class="edge">
<title>dispatcher&#45;&gt;frontierempty</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M3103.55,-868.9C3395.99,-840.27 3927,-780.23 4104,-707.2 4140.67,-692.07 4178.2,-671.85 4212.51,-651.16"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="4213.54,-653.61 4218.58,-647.47 4210.8,-649.12 4213.54,-653.61"/>
</g>
<!-- dispatcher&#45;&gt;beads -->
<g id="edge10" class="edge">
<title>dispatcher&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M3103.47,-872.29C3324.1,-851.33 3659.77,-804.12 3738,-707.2 3816.5,-609.95 3822.44,-518.14 3738,-426 3642.38,-321.65 1566.87,-206.17 920.45,-172.62"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="920.75,-170.01 913.13,-172.24 920.48,-175.25 920.75,-170.01"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="3799.12,-544.6 3799.12,-567.4 3984.86,-567.4 3984.86,-544.6 3799.12,-544.6"/>
<text xml:space="preserve" text-anchor="start" x="3802.12" y="-550.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">bd ready &#45;&#45;claim / bd unclaim</text>
</g>
<!-- dispatcher&#45;&gt;origin -->
<g id="edge11" class="edge">
<title>dispatcher&#45;&gt;origin</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M3103.49,-885.8C3620.03,-880.64 4975.45,-853.17 5110,-707.2 5194.71,-615.31 5189.26,-522.63 5110,-426 4969.22,-254.36 4309.58,-192.57 3980.16,-172.16"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="3980.7,-169.57 3973.05,-171.73 3980.38,-174.81 3980.7,-169.57"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="5171.5,-536.2 5171.5,-575.8 5421.86,-575.8 5421.86,-536.2 5171.5,-536.2"/>
<text xml:space="preserve" text-anchor="start" x="5174.5" y="-558.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">ensureEpicGatePr — push epic branch,</text>
<text xml:space="preserve" text-anchor="start" x="5174.5" y="-542" font-family="Arial" font-size="14.00" fill="#c9c9c9">open PR, write pr on the gate</text>
</g>
<!-- hook&#45;&gt;origin -->
<g id="edge12" class="edge">
<title>hook&#45;&gt;origin</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M5665.26,-466.03C5569.49,-429.26 5453.72,-389.82 5346,-366.4 4859.39,-260.59 4274.3,-202.11 3980.24,-177.37"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="3980.62,-174.77 3972.92,-176.76 3980.18,-180 3980.62,-174.77"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="5480.04,-366.4 5480.04,-406 5679.01,-406 5679.01,-366.4 5480.04,-366.4"/>
<text xml:space="preserve" text-anchor="start" x="5483.04" y="-389" font-family="Arial" font-size="14.00" fill="#c9c9c9">commit, push, PR — only when</text>
<text xml:space="preserve" text-anchor="start" x="5483.04" y="-372.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">BO_DONE_FILE exists</text>
</g>
<!-- human&#45;&gt;backenda -->
<g id="edge13" class="edge">
<title>human&#45;&gt;backenda</title>
<path fill="none" stroke="#a35905" stroke-width="2" stroke-dasharray="5,2" d="M256,-466.05C256,-421.61 256,-366.58 256,-315.66"/>
<polygon fill="#a35905" stroke="#a35905" stroke-width="2" points="258.63,-315.73 256,-308.23 253.38,-315.73 258.63,-315.73"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="129.39,-385.44 129.39,-408.24 256,-408.24 256,-385.44 129.39,-385.44"/>
<text xml:space="preserve" text-anchor="start" x="132.39" y="-391.24" font-family="Arial" font-size="14.00" fill="#ffffff">after feature&#45;review</text>
</g>
<!-- decisions&#45;&gt;planepic -->
</g>
</svg>
`;case`towerMap`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 16.1.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1074pt" height="2488pt"
 viewBox="0.00 0.00 1074.00 2488.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 2473.45)">
<g id="clust1" class="cluster">
<title>cluster_epic</title>
<polygon fill="#694012" stroke="#532e0c" points="8,-8 8,-2450.4 1036,-2450.4 1036,-8 8,-8"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-2437.5" font-family="Arial" font-weight="bold" font-size="11.00" fill="#ffffff" fill-opacity="0.701961">EPIC — RECIPE BOX (RECIPE&#45;1)</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_feata</title>
<polygon fill="#764610" stroke="#5d320a" points="48,-908 48,-2389.2 502,-2389.2 502,-908 48,-908"/>
<text xml:space="preserve" text-anchor="start" x="56" y="-2376.3" font-family="Arial" font-weight="bold" font-size="11.00" fill="#ffffff" fill-opacity="0.701961">FEATURE — ADD A RECIPE (RECIPE&#45;5)</text>
</g>
<g id="clust3" class="cluster">
<title>cluster_featb</title>
<polygon fill="#764610" stroke="#5d320a" points="542,-908 542,-2389.2 996,-2389.2 996,-908 542,-908"/>
<text xml:space="preserve" text-anchor="start" x="550" y="-2376.3" font-family="Arial" font-weight="bold" font-size="11.00" fill="#ffffff" fill-opacity="0.701961">FEATURE — SEARCH THE BOX (RECIPE&#45;11)</text>
</g>
<!-- backenda -->
<g id="node1" class="node">
<title>backenda</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="459.43,-2328 90.57,-2328 90.57,-2148 459.43,-2148 459.43,-2328"/>
<text xml:space="preserve" text-anchor="start" x="138.69" y="-2232.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="182.64" y="-2277" font-family="Arial" font-size="20.00" fill="#ffffff">backend&#45;logic (RECIPE&#45;6)</text>
<text xml:space="preserve" text-anchor="start" x="437.42" y="-2232.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="182.64" y="-2254" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="182.64" y="-2236" font-family="Arial" font-size="15.00" fill="#f6ffff">validateRecipe + saveRecipe — pure</text>
<text xml:space="preserve" text-anchor="start" x="182.64" y="-2218" font-family="Arial" font-size="15.00" fill="#f6ffff">functions</text>
<text xml:space="preserve" text-anchor="start" x="182.64" y="-2200" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;backend&#45;logic</text>
<text xml:space="preserve" text-anchor="start" x="182.64" y="-2182" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: engineer</text>
</g>
<!-- unita -->
<g id="node2" class="node">
<title>unita</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="435.02,-2028 114.98,-2028 114.98,-1848 435.02,-1848 435.02,-2028"/>
<text xml:space="preserve" text-anchor="start" x="164.92" y="-1932.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="208.87" y="-1977" font-family="Arial" font-size="20.00" fill="#ffffff">unit&#45;tests (RECIPE&#45;7)</text>
<text xml:space="preserve" text-anchor="start" x="411.19" y="-1932.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="208.87" y="-1954" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="208.87" y="-1936" font-family="Arial" font-size="15.00" fill="#f6ffff">exhaustive coverage for</text>
<text xml:space="preserve" text-anchor="start" x="208.87" y="-1918" font-family="Arial" font-size="15.00" fill="#f6ffff">validateRecipe</text>
<text xml:space="preserve" text-anchor="start" x="208.87" y="-1900" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;unit&#45;tests</text>
<text xml:space="preserve" text-anchor="start" x="208.87" y="-1882" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;unit (respawn)</text>
</g>
<!-- frontenda -->
<g id="node3" class="node">
<title>frontenda</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="452.33,-1728 97.67,-1728 97.67,-1548 452.33,-1548 452.33,-1728"/>
<text xml:space="preserve" text-anchor="start" x="145.79" y="-1632.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="189.74" y="-1677" font-family="Arial" font-size="20.00" fill="#ffffff">frontend&#45;ui (RECIPE&#45;8)</text>
<text xml:space="preserve" text-anchor="start" x="430.32" y="-1632.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="189.74" y="-1654" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="189.74" y="-1636" font-family="Arial" font-size="15.00" fill="#f6ffff">RecipeForm + RecipeCard against</text>
<text xml:space="preserve" text-anchor="start" x="189.74" y="-1618" font-family="Arial" font-size="15.00" fill="#f6ffff">proved functions</text>
<text xml:space="preserve" text-anchor="start" x="189.74" y="-1600" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;frontend&#45;ui</text>
<text xml:space="preserve" text-anchor="start" x="189.74" y="-1582" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: frontend</text>
</g>
<!-- featuretesta -->
<g id="node4" class="node">
<title>featuretesta</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="443.21,-1428 106.79,-1428 106.79,-1248 443.21,-1248 443.21,-1428"/>
<text xml:space="preserve" text-anchor="start" x="154.91" y="-1332.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="198.86" y="-1377" font-family="Arial" font-size="20.00" fill="#ffffff">feature&#45;test (RECIPE&#45;9)</text>
<text xml:space="preserve" text-anchor="start" x="421.2" y="-1332.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="198.86" y="-1354" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="198.86" y="-1336" font-family="Arial" font-size="15.00" fill="#f6ffff">the add&#45;recipe pieces are wired</text>
<text xml:space="preserve" text-anchor="start" x="198.86" y="-1318" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;feature&#45;test</text>
<text xml:space="preserve" text-anchor="start" x="198.86" y="-1300" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;feature (respawn)</text>
<text xml:space="preserve" text-anchor="start" x="198.86" y="-1282" font-family="Arial" font-size="15.00" fill="#f6ffff">category: feature&#45;test</text>
</g>
<!-- featurereviewa -->
<g id="node5" class="node">
<title>featurereviewa</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="461.55,-1128 88.45,-1128 88.45,-948 461.55,-948 461.55,-1128"/>
<text xml:space="preserve" text-anchor="start" x="136.57" y="-1032.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="180.52" y="-1077" font-family="Arial" font-size="20.00" fill="#ffffff">feature&#45;review (RECIPE&#45;10)</text>
<text xml:space="preserve" text-anchor="start" x="439.54" y="-1032.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="180.52" y="-1054" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="180.52" y="-1036" font-family="Arial" font-size="15.00" fill="#f6ffff">the three questions over</text>
<text xml:space="preserve" text-anchor="start" x="180.52" y="-1018" font-family="Arial" font-size="15.00" fill="#f6ffff">feature/add&#45;recipe</text>
<text xml:space="preserve" text-anchor="start" x="180.52" y="-1000" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;feature&#45;review</text>
<text xml:space="preserve" text-anchor="start" x="180.52" y="-982" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: review (respawn)</text>
</g>
<!-- backendb -->
<g id="node6" class="node">
<title>backendb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="953.89,-2328 584.11,-2328 584.11,-2148 953.89,-2148 953.89,-2328"/>
<text xml:space="preserve" text-anchor="start" x="632.23" y="-2232.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="676.17" y="-2277" font-family="Arial" font-size="20.00" fill="#ffffff">backend&#45;logic (RECIPE&#45;12)</text>
<text xml:space="preserve" text-anchor="start" x="931.88" y="-2232.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="676.17" y="-2254" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="676.17" y="-2236" font-family="Arial" font-size="15.00" fill="#f6ffff">searchRecipes — pure filter over</text>
<text xml:space="preserve" text-anchor="start" x="676.17" y="-2218" font-family="Arial" font-size="15.00" fill="#f6ffff">the repository port</text>
<text xml:space="preserve" text-anchor="start" x="676.17" y="-2200" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;backend&#45;logic</text>
<text xml:space="preserve" text-anchor="start" x="676.17" y="-2182" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: engineer</text>
</g>
<!-- unitb -->
<g id="node7" class="node">
<title>unitb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="932.76,-2028 605.24,-2028 605.24,-1848 932.76,-1848 932.76,-2028"/>
<text xml:space="preserve" text-anchor="start" x="653.36" y="-1932.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="697.31" y="-1977" font-family="Arial" font-size="20.00" fill="#ffffff">unit&#45;tests (RECIPE&#45;13)</text>
<text xml:space="preserve" text-anchor="start" x="910.75" y="-1932.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="697.31" y="-1954" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="697.31" y="-1936" font-family="Arial" font-size="15.00" fill="#f6ffff">exhaustive coverage for</text>
<text xml:space="preserve" text-anchor="start" x="697.31" y="-1918" font-family="Arial" font-size="15.00" fill="#f6ffff">searchRecipes</text>
<text xml:space="preserve" text-anchor="start" x="697.31" y="-1900" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;unit&#45;tests</text>
<text xml:space="preserve" text-anchor="start" x="697.31" y="-1882" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;unit (respawn)</text>
</g>
<!-- frontendb -->
<g id="node8" class="node">
<title>frontendb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="939.99,-1728 598.01,-1728 598.01,-1548 939.99,-1548 939.99,-1728"/>
<text xml:space="preserve" text-anchor="start" x="646.12" y="-1632.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="690.07" y="-1677" font-family="Arial" font-size="20.00" fill="#ffffff">frontend&#45;ui (RECIPE&#45;14)</text>
<text xml:space="preserve" text-anchor="start" x="917.99" y="-1632.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="690.07" y="-1654" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="690.07" y="-1636" font-family="Arial" font-size="15.00" fill="#f6ffff">SearchBar + live results list</text>
<text xml:space="preserve" text-anchor="start" x="690.07" y="-1618" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;frontend&#45;ui</text>
<text xml:space="preserve" text-anchor="start" x="690.07" y="-1600" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: frontend</text>
<text xml:space="preserve" text-anchor="start" x="690.07" y="-1582" font-family="Arial" font-size="15.00" fill="#f6ffff">category: frontend&#45;ux</text>
</g>
<!-- featuretestb -->
<g id="node9" class="node">
<title>featuretestb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="942.77,-1428 595.23,-1428 595.23,-1248 942.77,-1248 942.77,-1428"/>
<text xml:space="preserve" text-anchor="start" x="643.35" y="-1332.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="687.3" y="-1377" font-family="Arial" font-size="20.00" fill="#ffffff">feature&#45;test (RECIPE&#45;15)</text>
<text xml:space="preserve" text-anchor="start" x="920.76" y="-1332.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="687.3" y="-1354" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="687.3" y="-1336" font-family="Arial" font-size="15.00" fill="#f6ffff">the search pieces are wired</text>
<text xml:space="preserve" text-anchor="start" x="687.3" y="-1318" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;feature&#45;test</text>
<text xml:space="preserve" text-anchor="start" x="687.3" y="-1300" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;feature (respawn)</text>
<text xml:space="preserve" text-anchor="start" x="687.3" y="-1282" font-family="Arial" font-size="15.00" fill="#f6ffff">category: feature&#45;test</text>
</g>
<!-- featurereviewb -->
<g id="node10" class="node">
<title>featurereviewb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="955.55,-1128 582.45,-1128 582.45,-948 955.55,-948 955.55,-1128"/>
<text xml:space="preserve" text-anchor="start" x="630.57" y="-1032.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="674.52" y="-1077" font-family="Arial" font-size="20.00" fill="#ffffff">feature&#45;review (RECIPE&#45;16)</text>
<text xml:space="preserve" text-anchor="start" x="933.54" y="-1032.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="674.52" y="-1054" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="674.52" y="-1036" font-family="Arial" font-size="15.00" fill="#f6ffff">the three questions over</text>
<text xml:space="preserve" text-anchor="start" x="674.52" y="-1018" font-family="Arial" font-size="15.00" fill="#f6ffff">feature/search&#45;recipes</text>
<text xml:space="preserve" text-anchor="start" x="674.52" y="-1000" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;feature&#45;review</text>
<text xml:space="preserve" text-anchor="start" x="674.52" y="-982" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: review (respawn)</text>
</g>
<!-- epicmergepr -->
<g id="node11" class="node">
<title>epicmergepr</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="703.72,-828 340.28,-828 340.28,-648 703.72,-648 703.72,-828"/>
<text xml:space="preserve" text-anchor="start" x="388.4" y="-732.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="432.34" y="-777" font-family="Arial" font-size="20.00" fill="#ffffff">epic&#45;merge&#45;pr (RECIPE&#45;2)</text>
<text xml:space="preserve" text-anchor="start" x="681.71" y="-732.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="432.34" y="-754" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="432.34" y="-736" font-family="Arial" font-size="15.00" fill="#f6ffff">assemble the feature branches onto</text>
<text xml:space="preserve" text-anchor="start" x="432.34" y="-718" font-family="Arial" font-size="15.00" fill="#f6ffff">epic/recipe&#45;box</text>
<text xml:space="preserve" text-anchor="start" x="432.34" y="-700" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;epic&#45;merge&#45;pr</text>
<text xml:space="preserve" text-anchor="start" x="432.34" y="-682" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: merge</text>
</g>
<!-- epice2e -->
<g id="node12" class="node">
<title>epice2e</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="699.55,-528 344.45,-528 344.45,-348 699.55,-348 699.55,-528"/>
<text xml:space="preserve" text-anchor="start" x="392.57" y="-432.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="436.52" y="-477" font-family="Arial" font-size="20.00" fill="#ffffff">epic&#45;e2e&#45;test (RECIPE&#45;3)</text>
<text xml:space="preserve" text-anchor="start" x="677.54" y="-432.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="436.52" y="-454" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="436.52" y="-436" font-family="Arial" font-size="15.00" fill="#f6ffff">journeys across the whole app in a</text>
<text xml:space="preserve" text-anchor="start" x="436.52" y="-418" font-family="Arial" font-size="15.00" fill="#f6ffff">real browser</text>
<text xml:space="preserve" text-anchor="start" x="436.52" y="-400" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;epic&#45;e2e&#45;test</text>
<text xml:space="preserve" text-anchor="start" x="436.52" y="-382" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;e2e (respawn)</text>
</g>
<!-- epicreview -->
<g id="node13" class="node">
<title>epicreview</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="698.72,-228 345.28,-228 345.28,-48 698.72,-48 698.72,-228"/>
<text xml:space="preserve" text-anchor="start" x="393.4" y="-132.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="437.34" y="-177" font-family="Arial" font-size="20.00" fill="#ffffff">epic&#45;review (RECIPE&#45;4)</text>
<text xml:space="preserve" text-anchor="start" x="676.71" y="-132.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="437.34" y="-154" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="437.34" y="-136" font-family="Arial" font-size="15.00" fill="#f6ffff">the three questions over the whole</text>
<text xml:space="preserve" text-anchor="start" x="437.34" y="-118" font-family="Arial" font-size="15.00" fill="#f6ffff">epic</text>
<text xml:space="preserve" text-anchor="start" x="437.34" y="-100" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;epic&#45;review</text>
<text xml:space="preserve" text-anchor="start" x="437.34" y="-82" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: review (respawn)</text>
</g>
<!-- backenda&#45;&gt;unita -->
<g id="edge1" class="edge">
<title>backenda&#45;&gt;unita</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M275,-2148.4C275,-2113.73 275,-2073.81 275,-2038.19"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="277.63,-2038.3 275,-2030.8 272.38,-2038.3 277.63,-2038.3"/>
</g>
<!-- unita&#45;&gt;frontenda -->
<g id="edge4" class="edge">
<title>unita&#45;&gt;frontenda</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M275,-1848.4C275,-1813.73 275,-1773.81 275,-1738.19"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="277.63,-1738.3 275,-1730.8 272.38,-1738.3 277.63,-1738.3"/>
</g>
<!-- frontenda&#45;&gt;featuretesta -->
<g id="edge7" class="edge">
<title>frontenda&#45;&gt;featuretesta</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M275,-1548.4C275,-1513.73 275,-1473.81 275,-1438.19"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="277.63,-1438.3 275,-1430.8 272.38,-1438.3 277.63,-1438.3"/>
</g>
<!-- featuretesta&#45;&gt;featurereviewa -->
<g id="edge9" class="edge">
<title>featuretesta&#45;&gt;featurereviewa</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M275,-1248.4C275,-1213.73 275,-1173.81 275,-1138.19"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="277.63,-1138.3 275,-1130.8 272.38,-1138.3 277.63,-1138.3"/>
</g>
<!-- featurereviewa&#45;&gt;epicmergepr -->
<g id="edge11" class="edge">
<title>featurereviewa&#45;&gt;epicmergepr</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M381.92,-908C402.1,-883.66 422.88,-858.58 442.06,-835.45"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="443.72,-837.56 446.49,-830.11 439.68,-834.21 443.72,-837.56"/>
</g>
<!-- backendb&#45;&gt;unitb -->
<g id="edge2" class="edge">
<title>backendb&#45;&gt;unitb</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M769,-2148.4C769,-2113.73 769,-2073.81 769,-2038.19"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="771.63,-2038.3 769,-2030.8 766.38,-2038.3 771.63,-2038.3"/>
</g>
<!-- unitb&#45;&gt;frontendb -->
<g id="edge5" class="edge">
<title>unitb&#45;&gt;frontendb</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M769,-1848.4C769,-1813.73 769,-1773.81 769,-1738.19"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="771.63,-1738.3 769,-1730.8 766.38,-1738.3 771.63,-1738.3"/>
</g>
<!-- frontendb&#45;&gt;featuretestb -->
<g id="edge8" class="edge">
<title>frontendb&#45;&gt;featuretestb</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M769,-1548.4C769,-1513.73 769,-1473.81 769,-1438.19"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="771.63,-1438.3 769,-1430.8 766.38,-1438.3 771.63,-1438.3"/>
</g>
<!-- featuretestb&#45;&gt;featurereviewb -->
<g id="edge10" class="edge">
<title>featuretestb&#45;&gt;featurereviewb</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M769,-1248.4C769,-1213.73 769,-1173.81 769,-1138.19"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="771.63,-1138.3 769,-1130.8 766.38,-1138.3 771.63,-1138.3"/>
</g>
<!-- featurereviewb&#45;&gt;epicmergepr -->
<g id="edge12" class="edge">
<title>featurereviewb&#45;&gt;epicmergepr</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M662.08,-908C641.9,-883.66 621.12,-858.58 601.94,-835.45"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="604.32,-834.21 597.51,-830.11 600.28,-837.56 604.32,-834.21"/>
</g>
<!-- epicmergepr&#45;&gt;epice2e -->
<g id="edge3" class="edge">
<title>epicmergepr&#45;&gt;epice2e</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M522,-648.4C522,-613.73 522,-573.81 522,-538.19"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="524.63,-538.3 522,-530.8 519.38,-538.3 524.63,-538.3"/>
</g>
<!-- epice2e&#45;&gt;epicreview -->
<g id="edge6" class="edge">
<title>epice2e&#45;&gt;epicreview</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M522,-348.4C522,-313.73 522,-273.81 522,-238.19"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="524.63,-238.3 522,-230.8 519.38,-238.3 524.63,-238.3"/>
</g>
</g>
</svg>
`;case`allBranches`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 16.1.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="3110pt" height="2147pt"
 viewBox="0.00 0.00 3110.00 2147.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 2131.65)">
<g id="clust1" class="cluster">
<title>cluster_worktreesroot</title>
<polygon fill="#0d4936" stroke="#083625" points="8,-8 8,-2108.6 3072,-2108.6 3072,-8 8,-8"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-2095.7" font-family="Arial" font-weight="bold" font-size="11.00" fill="#eeffff" fill-opacity="0.701961">.CLAUDE/WORKTREES/ — ONE BOX PER BRANCH</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_wtepic</title>
<polygon fill="#0c513c" stroke="#073c28" points="58,-58 58,-1357.6 1004,-1357.6 1004,-58 58,-58"/>
<text xml:space="preserve" text-anchor="start" x="66" y="-1344.7" font-family="Arial" font-weight="bold" font-size="11.00" fill="#eeffff" fill-opacity="0.701961">EPIC+RECIPE&#45;BOX → EPIC/RECIPE&#45;BOX</text>
</g>
<g id="clust3" class="cluster">
<title>cluster_wta</title>
<polygon fill="#0c513c" stroke="#073c28" points="1054,-58 1054,-2037.4 2012,-2037.4 2012,-58 1054,-58"/>
<text xml:space="preserve" text-anchor="start" x="1062" y="-2024.5" font-family="Arial" font-weight="bold" font-size="11.00" fill="#eeffff" fill-opacity="0.701961">FEATURE+ADD&#45;RECIPE → FEATURE/ADD&#45;RECIPE</text>
</g>
<g id="clust4" class="cluster">
<title>cluster_wtb</title>
<polygon fill="#0c513c" stroke="#073c28" points="2062,-58 2062,-2037.4 3022,-2037.4 3022,-58 2062,-58"/>
<text xml:space="preserve" text-anchor="start" x="2070" y="-2024.5" font-family="Arial" font-weight="bold" font-size="11.00" fill="#eeffff" fill-opacity="0.701961">FEATURE+SEARCH&#45;RECIPES → FEATURE/SEARCH&#45;RECIPES</text>
</g>
<!-- mergerun -->
<g id="node1" class="node">
<title>mergerun</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="467.13,-1286.4 112.87,-1286.4 112.87,-1106.4 467.13,-1106.4 467.13,-1286.4"/>
<text xml:space="preserve" text-anchor="start" x="160.99" y="-1190.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="204.94" y="-1235.4" font-family="Arial" font-size="20.00" fill="#ffffff">merge</text>
<text xml:space="preserve" text-anchor="start" x="445.12" y="-1190.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="204.94" y="-1212.4" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the epic&#45;tier assembler</text>
<text xml:space="preserve" text-anchor="start" x="204.94" y="-1194.4" font-family="Arial" font-size="15.00" fill="#ffffff">— reads the feature branches off</text>
<text xml:space="preserve" text-anchor="start" x="204.94" y="-1176.4" font-family="Arial" font-size="15.00" fill="#ffffff">the feature gates, assembles them</text>
<text xml:space="preserve" text-anchor="start" x="204.94" y="-1158.4" font-family="Arial" font-size="15.00" fill="#ffffff">onto the epic branch in its own</text>
<text xml:space="preserve" text-anchor="start" x="204.94" y="-1140.4" font-family="Arial" font-size="15.00" fill="#ffffff">worktree, resolves the conflicts</text>
</g>
<!-- e2erun -->
<g id="node2" class="node">
<title>e2erun</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="942.04,-953.6 601.96,-953.6 601.96,-773.6 942.04,-773.6 942.04,-953.6"/>
<text xml:space="preserve" text-anchor="start" x="650.08" y="-858" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="694.03" y="-912.4" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;e2e</text>
<text xml:space="preserve" text-anchor="start" x="920.03" y="-858" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="694.03" y="-891.4" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="694.03" y="-869.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the broad tier —</text>
<text xml:space="preserve" text-anchor="start" x="694.03" y="-851.8" font-family="Arial" font-size="15.00" fill="#ffffff">journeys across features on the</text>
<text xml:space="preserve" text-anchor="start" x="694.03" y="-833.8" font-family="Arial" font-size="15.00" fill="#ffffff">real stack; cross&#45;feature state;</text>
<text xml:space="preserve" text-anchor="start" x="694.03" y="-815.8" font-family="Arial" font-size="15.00" fill="#ffffff">one success + one failure per</text>
<text xml:space="preserve" text-anchor="start" x="694.03" y="-797.8" font-family="Arial" font-size="15.00" fill="#ffffff">feature. Label epic&#45;e2e&#45;test, skill</text>
</g>
<!-- epicreviewrun -->
<g id="node3" class="node">
<title>epicreviewrun</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="954.05,-620.8 593.95,-620.8 593.95,-440.8 954.05,-440.8 954.05,-620.8"/>
<text xml:space="preserve" text-anchor="start" x="642.07" y="-525.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="686.01" y="-569.8" font-family="Arial" font-size="20.00" fill="#ffffff">review</text>
<text xml:space="preserve" text-anchor="start" x="932.04" y="-525.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="686.01" y="-546.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the reviewer — three</text>
<text xml:space="preserve" text-anchor="start" x="686.01" y="-528.8" font-family="Arial" font-size="15.00" fill="#ffffff">questions from first principles:</text>
<text xml:space="preserve" text-anchor="start" x="686.01" y="-510.8" font-family="Arial" font-size="15.00" fill="#ffffff">does the code do what its source of</text>
<text xml:space="preserve" text-anchor="start" x="686.01" y="-492.8" font-family="Arial" font-size="15.00" fill="#ffffff">truth demands, do the tests prove</text>
<text xml:space="preserve" text-anchor="start" x="686.01" y="-474.8" font-family="Arial" font-size="15.00" fill="#ffffff">it, is it simple and readable. Maps</text>
</g>
<!-- enga -->
<g id="node4" class="node">
<title>enga</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="1465.95,-1966.2 1110.05,-1966.2 1110.05,-1786.2 1465.95,-1786.2 1465.95,-1966.2"/>
<text xml:space="preserve" text-anchor="start" x="1158.17" y="-1870.6" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1202.11" y="-1915.2" font-family="Arial" font-size="20.00" fill="#ffffff">engineer</text>
<text xml:space="preserve" text-anchor="start" x="1443.94" y="-1870.6" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1202.11" y="-1892.2" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the back&#45;end worker —</text>
<text xml:space="preserve" text-anchor="start" x="1202.11" y="-1874.2" font-family="Arial" font-size="15.00" fill="#ffffff">business logic, endpoints, hooks,</text>
<text xml:space="preserve" text-anchor="start" x="1202.11" y="-1856.2" font-family="Arial" font-size="15.00" fill="#ffffff">types, error factories. Spawned s b</text>
<text xml:space="preserve" text-anchor="start" x="1202.11" y="-1838.2" font-family="Arial" font-size="15.00" fill="#ffffff">w, certified by respawn. Never</text>
<text xml:space="preserve" text-anchor="start" x="1202.11" y="-1820.2" font-family="Arial" font-size="15.00" fill="#ffffff">writes tests, JSX, or CSS.</text>
</g>
<!-- unita -->
<g id="node5" class="node">
<title>unita</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="1961.61,-1633.4 1602.39,-1633.4 1602.39,-1453.4 1961.61,-1453.4 1961.61,-1633.4"/>
<text xml:space="preserve" text-anchor="start" x="1650.51" y="-1537.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1694.45" y="-1592.2" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;unit</text>
<text xml:space="preserve" text-anchor="start" x="1939.6" y="-1537.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1694.45" y="-1571.2" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="1694.45" y="-1549.6" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the micro tier — one</text>
<text xml:space="preserve" text-anchor="start" x="1694.45" y="-1531.6" font-family="Arial" font-size="15.00" fill="#ffffff">back&#45;end function alone; every</text>
<text xml:space="preserve" text-anchor="start" x="1694.45" y="-1513.6" font-family="Arial" font-size="15.00" fill="#ffffff">branch, boundary, empty/null,</text>
<text xml:space="preserve" text-anchor="start" x="1694.45" y="-1495.6" font-family="Arial" font-size="15.00" fill="#ffffff">error. Never a component (the UI is</text>
<text xml:space="preserve" text-anchor="start" x="1694.45" y="-1477.6" font-family="Arial" font-size="15.00" fill="#ffffff">proved by the composition tier).</text>
</g>
<!-- fea -->
<g id="node6" class="node">
<title>fea</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="1917.78,-1286.4 1580.22,-1286.4 1580.22,-1106.4 1917.78,-1106.4 1917.78,-1286.4"/>
<text xml:space="preserve" text-anchor="start" x="1628.34" y="-1190.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1672.28" y="-1235.4" font-family="Arial" font-size="20.00" fill="#ffffff">frontend</text>
<text xml:space="preserve" text-anchor="start" x="1895.77" y="-1190.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1672.28" y="-1212.4" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the UI worker —</text>
<text xml:space="preserve" text-anchor="start" x="1672.28" y="-1194.4" font-family="Arial" font-size="15.00" fill="#ffffff">components, layout, styling, the</text>
<text xml:space="preserve" text-anchor="start" x="1672.28" y="-1176.4" font-family="Arial" font-size="15.00" fill="#ffffff">shared component system. Built</text>
<text xml:space="preserve" text-anchor="start" x="1672.28" y="-1158.4" font-family="Arial" font-size="15.00" fill="#ffffff">last, against functions already</text>
<text xml:space="preserve" text-anchor="start" x="1672.28" y="-1140.4" font-family="Arial" font-size="15.00" fill="#ffffff">proved. Label frontend&#45;ui.</text>
</g>
<!-- fta -->
<g id="node7" class="node">
<title>fta</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="1958.06,-953.6 1605.94,-953.6 1605.94,-773.6 1958.06,-773.6 1958.06,-953.6"/>
<text xml:space="preserve" text-anchor="start" x="1654.06" y="-858" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1698" y="-912.4" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;feature</text>
<text xml:space="preserve" text-anchor="start" x="1936.05" y="-858" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1698" y="-891.4" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="1698" y="-869.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the composition tier —</text>
<text xml:space="preserve" text-anchor="start" x="1698" y="-851.8" font-family="Arial" font-size="15.00" fill="#ffffff">one feature&#39;s pieces proved wired;</text>
<text xml:space="preserve" text-anchor="start" x="1698" y="-833.8" font-family="Arial" font-size="15.00" fill="#ffffff">its errors and successes surface.</text>
<text xml:space="preserve" text-anchor="start" x="1698" y="-815.8" font-family="Arial" font-size="15.00" fill="#ffffff">Never re&#45;runs the unit tier&#39;s</text>
<text xml:space="preserve" text-anchor="start" x="1698" y="-797.8" font-family="Arial" font-size="15.00" fill="#ffffff">edge&#45;case matrix. Label</text>
</g>
<!-- reva -->
<g id="node8" class="node">
<title>reva</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="1960.05,-620.8 1599.95,-620.8 1599.95,-440.8 1960.05,-440.8 1960.05,-620.8"/>
<text xml:space="preserve" text-anchor="start" x="1648.07" y="-525.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1692.01" y="-569.8" font-family="Arial" font-size="20.00" fill="#ffffff">review</text>
<text xml:space="preserve" text-anchor="start" x="1938.04" y="-525.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1692.01" y="-546.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the reviewer — three</text>
<text xml:space="preserve" text-anchor="start" x="1692.01" y="-528.8" font-family="Arial" font-size="15.00" fill="#ffffff">questions from first principles:</text>
<text xml:space="preserve" text-anchor="start" x="1692.01" y="-510.8" font-family="Arial" font-size="15.00" fill="#ffffff">does the code do what its source of</text>
<text xml:space="preserve" text-anchor="start" x="1692.01" y="-492.8" font-family="Arial" font-size="15.00" fill="#ffffff">truth demands, do the tests prove</text>
<text xml:space="preserve" text-anchor="start" x="1692.01" y="-474.8" font-family="Arial" font-size="15.00" fill="#ffffff">it, is it simple and readable. Maps</text>
</g>
<!-- engb -->
<g id="node9" class="node">
<title>engb</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="2474.95,-1966.2 2119.05,-1966.2 2119.05,-1786.2 2474.95,-1786.2 2474.95,-1966.2"/>
<text xml:space="preserve" text-anchor="start" x="2167.17" y="-1870.6" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2211.11" y="-1915.2" font-family="Arial" font-size="20.00" fill="#ffffff">engineer</text>
<text xml:space="preserve" text-anchor="start" x="2452.94" y="-1870.6" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2211.11" y="-1892.2" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the back&#45;end worker —</text>
<text xml:space="preserve" text-anchor="start" x="2211.11" y="-1874.2" font-family="Arial" font-size="15.00" fill="#ffffff">business logic, endpoints, hooks,</text>
<text xml:space="preserve" text-anchor="start" x="2211.11" y="-1856.2" font-family="Arial" font-size="15.00" fill="#ffffff">types, error factories. Spawned s b</text>
<text xml:space="preserve" text-anchor="start" x="2211.11" y="-1838.2" font-family="Arial" font-size="15.00" fill="#ffffff">w, certified by respawn. Never</text>
<text xml:space="preserve" text-anchor="start" x="2211.11" y="-1820.2" font-family="Arial" font-size="15.00" fill="#ffffff">writes tests, JSX, or CSS.</text>
</g>
<!-- unitb -->
<g id="node10" class="node">
<title>unitb</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="2971.61,-1633.4 2612.39,-1633.4 2612.39,-1453.4 2971.61,-1453.4 2971.61,-1633.4"/>
<text xml:space="preserve" text-anchor="start" x="2660.51" y="-1537.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2704.45" y="-1592.2" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;unit</text>
<text xml:space="preserve" text-anchor="start" x="2949.6" y="-1537.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2704.45" y="-1571.2" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="2704.45" y="-1549.6" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the micro tier — one</text>
<text xml:space="preserve" text-anchor="start" x="2704.45" y="-1531.6" font-family="Arial" font-size="15.00" fill="#ffffff">back&#45;end function alone; every</text>
<text xml:space="preserve" text-anchor="start" x="2704.45" y="-1513.6" font-family="Arial" font-size="15.00" fill="#ffffff">branch, boundary, empty/null,</text>
<text xml:space="preserve" text-anchor="start" x="2704.45" y="-1495.6" font-family="Arial" font-size="15.00" fill="#ffffff">error. Never a component (the UI is</text>
<text xml:space="preserve" text-anchor="start" x="2704.45" y="-1477.6" font-family="Arial" font-size="15.00" fill="#ffffff">proved by the composition tier).</text>
</g>
<!-- feb -->
<g id="node11" class="node">
<title>feb</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="2929.78,-1286.4 2592.22,-1286.4 2592.22,-1106.4 2929.78,-1106.4 2929.78,-1286.4"/>
<text xml:space="preserve" text-anchor="start" x="2640.34" y="-1190.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2684.28" y="-1235.4" font-family="Arial" font-size="20.00" fill="#ffffff">frontend</text>
<text xml:space="preserve" text-anchor="start" x="2907.77" y="-1190.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2684.28" y="-1212.4" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the UI worker —</text>
<text xml:space="preserve" text-anchor="start" x="2684.28" y="-1194.4" font-family="Arial" font-size="15.00" fill="#ffffff">components, layout, styling, the</text>
<text xml:space="preserve" text-anchor="start" x="2684.28" y="-1176.4" font-family="Arial" font-size="15.00" fill="#ffffff">shared component system. Built</text>
<text xml:space="preserve" text-anchor="start" x="2684.28" y="-1158.4" font-family="Arial" font-size="15.00" fill="#ffffff">last, against functions already</text>
<text xml:space="preserve" text-anchor="start" x="2684.28" y="-1140.4" font-family="Arial" font-size="15.00" fill="#ffffff">proved. Label frontend&#45;ui.</text>
</g>
<!-- ftb -->
<g id="node12" class="node">
<title>ftb</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="2956.06,-953.6 2603.94,-953.6 2603.94,-773.6 2956.06,-773.6 2956.06,-953.6"/>
<text xml:space="preserve" text-anchor="start" x="2652.06" y="-858" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2696" y="-912.4" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;feature</text>
<text xml:space="preserve" text-anchor="start" x="2934.05" y="-858" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2696" y="-891.4" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="2696" y="-869.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the composition tier —</text>
<text xml:space="preserve" text-anchor="start" x="2696" y="-851.8" font-family="Arial" font-size="15.00" fill="#ffffff">one feature&#39;s pieces proved wired;</text>
<text xml:space="preserve" text-anchor="start" x="2696" y="-833.8" font-family="Arial" font-size="15.00" fill="#ffffff">its errors and successes surface.</text>
<text xml:space="preserve" text-anchor="start" x="2696" y="-815.8" font-family="Arial" font-size="15.00" fill="#ffffff">Never re&#45;runs the unit tier&#39;s</text>
<text xml:space="preserve" text-anchor="start" x="2696" y="-797.8" font-family="Arial" font-size="15.00" fill="#ffffff">edge&#45;case matrix. Label</text>
</g>
<!-- revb -->
<g id="node13" class="node">
<title>revb</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="2971.05,-620.8 2610.95,-620.8 2610.95,-440.8 2971.05,-440.8 2971.05,-620.8"/>
<text xml:space="preserve" text-anchor="start" x="2659.07" y="-525.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2703.01" y="-569.8" font-family="Arial" font-size="20.00" fill="#ffffff">review</text>
<text xml:space="preserve" text-anchor="start" x="2949.04" y="-525.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2703.01" y="-546.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the reviewer — three</text>
<text xml:space="preserve" text-anchor="start" x="2703.01" y="-528.8" font-family="Arial" font-size="15.00" fill="#ffffff">questions from first principles:</text>
<text xml:space="preserve" text-anchor="start" x="2703.01" y="-510.8" font-family="Arial" font-size="15.00" fill="#ffffff">does the code do what its source of</text>
<text xml:space="preserve" text-anchor="start" x="2703.01" y="-492.8" font-family="Arial" font-size="15.00" fill="#ffffff">truth demands, do the tests prove</text>
<text xml:space="preserve" text-anchor="start" x="2703.01" y="-474.8" font-family="Arial" font-size="15.00" fill="#ffffff">it, is it simple and readable. Maps</text>
</g>
<!-- t_merge -->
<g id="node14" class="node">
<title>t_merge</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="471.72,-953.6 108.28,-953.6 108.28,-773.6 471.72,-773.6 471.72,-953.6"/>
<text xml:space="preserve" text-anchor="start" x="156.4" y="-858" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="200.34" y="-902.6" font-family="Arial" font-size="20.00" fill="#ffffff">epic&#45;merge&#45;pr (RECIPE&#45;2)</text>
<text xml:space="preserve" text-anchor="start" x="449.71" y="-858" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="200.34" y="-879.6" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="200.34" y="-861.6" font-family="Arial" font-size="15.00" fill="#f6ffff">assemble the feature branches onto</text>
<text xml:space="preserve" text-anchor="start" x="200.34" y="-843.6" font-family="Arial" font-size="15.00" fill="#f6ffff">epic/recipe&#45;box</text>
<text xml:space="preserve" text-anchor="start" x="200.34" y="-825.6" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;epic&#45;merge&#45;pr</text>
<text xml:space="preserve" text-anchor="start" x="200.34" y="-807.6" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: merge</text>
</g>
<!-- t_backenda -->
<g id="node15" class="node">
<title>t_backenda</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="1472.43,-1633.4 1103.57,-1633.4 1103.57,-1453.4 1472.43,-1453.4 1472.43,-1633.4"/>
<text xml:space="preserve" text-anchor="start" x="1151.69" y="-1537.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1195.64" y="-1582.4" font-family="Arial" font-size="20.00" fill="#ffffff">backend&#45;logic (RECIPE&#45;6)</text>
<text xml:space="preserve" text-anchor="start" x="1450.42" y="-1537.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1195.64" y="-1559.4" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="1195.64" y="-1541.4" font-family="Arial" font-size="15.00" fill="#f6ffff">validateRecipe + saveRecipe — pure</text>
<text xml:space="preserve" text-anchor="start" x="1195.64" y="-1523.4" font-family="Arial" font-size="15.00" fill="#f6ffff">functions</text>
<text xml:space="preserve" text-anchor="start" x="1195.64" y="-1505.4" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;backend&#45;logic</text>
<text xml:space="preserve" text-anchor="start" x="1195.64" y="-1487.4" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: engineer</text>
</g>
<!-- t_backendb -->
<g id="node16" class="node">
<title>t_backendb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="2481.89,-1633.4 2112.11,-1633.4 2112.11,-1453.4 2481.89,-1453.4 2481.89,-1633.4"/>
<text xml:space="preserve" text-anchor="start" x="2160.23" y="-1537.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2204.17" y="-1582.4" font-family="Arial" font-size="20.00" fill="#ffffff">backend&#45;logic (RECIPE&#45;12)</text>
<text xml:space="preserve" text-anchor="start" x="2459.88" y="-1537.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2204.17" y="-1559.4" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="2204.17" y="-1541.4" font-family="Arial" font-size="15.00" fill="#f6ffff">searchRecipes — pure filter over</text>
<text xml:space="preserve" text-anchor="start" x="2204.17" y="-1523.4" font-family="Arial" font-size="15.00" fill="#f6ffff">the repository port</text>
<text xml:space="preserve" text-anchor="start" x="2204.17" y="-1505.4" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;backend&#45;logic</text>
<text xml:space="preserve" text-anchor="start" x="2204.17" y="-1487.4" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: engineer</text>
</g>
<!-- t_e2e -->
<g id="node17" class="node">
<title>t_e2e</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="463.55,-620.8 108.45,-620.8 108.45,-440.8 463.55,-440.8 463.55,-620.8"/>
<text xml:space="preserve" text-anchor="start" x="156.57" y="-525.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="200.52" y="-569.8" font-family="Arial" font-size="20.00" fill="#ffffff">epic&#45;e2e&#45;test (RECIPE&#45;3)</text>
<text xml:space="preserve" text-anchor="start" x="441.54" y="-525.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="200.52" y="-546.8" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="200.52" y="-528.8" font-family="Arial" font-size="15.00" fill="#f6ffff">journeys across the whole app in a</text>
<text xml:space="preserve" text-anchor="start" x="200.52" y="-510.8" font-family="Arial" font-size="15.00" fill="#f6ffff">real browser</text>
<text xml:space="preserve" text-anchor="start" x="200.52" y="-492.8" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;epic&#45;e2e&#45;test</text>
<text xml:space="preserve" text-anchor="start" x="200.52" y="-474.8" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;e2e (respawn)</text>
</g>
<!-- t_unita -->
<g id="node18" class="node">
<title>t_unita</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="1450.02,-1286.4 1129.98,-1286.4 1129.98,-1106.4 1450.02,-1106.4 1450.02,-1286.4"/>
<text xml:space="preserve" text-anchor="start" x="1179.92" y="-1190.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1223.87" y="-1235.4" font-family="Arial" font-size="20.00" fill="#ffffff">unit&#45;tests (RECIPE&#45;7)</text>
<text xml:space="preserve" text-anchor="start" x="1426.19" y="-1190.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1223.87" y="-1212.4" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="1223.87" y="-1194.4" font-family="Arial" font-size="15.00" fill="#f6ffff">exhaustive coverage for</text>
<text xml:space="preserve" text-anchor="start" x="1223.87" y="-1176.4" font-family="Arial" font-size="15.00" fill="#f6ffff">validateRecipe</text>
<text xml:space="preserve" text-anchor="start" x="1223.87" y="-1158.4" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;unit&#45;tests</text>
<text xml:space="preserve" text-anchor="start" x="1223.87" y="-1140.4" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;unit (respawn)</text>
</g>
<!-- t_unitb -->
<g id="node19" class="node">
<title>t_unitb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="2461.76,-1286.4 2134.24,-1286.4 2134.24,-1106.4 2461.76,-1106.4 2461.76,-1286.4"/>
<text xml:space="preserve" text-anchor="start" x="2182.36" y="-1190.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2226.31" y="-1235.4" font-family="Arial" font-size="20.00" fill="#ffffff">unit&#45;tests (RECIPE&#45;13)</text>
<text xml:space="preserve" text-anchor="start" x="2439.75" y="-1190.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2226.31" y="-1212.4" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="2226.31" y="-1194.4" font-family="Arial" font-size="15.00" fill="#f6ffff">exhaustive coverage for</text>
<text xml:space="preserve" text-anchor="start" x="2226.31" y="-1176.4" font-family="Arial" font-size="15.00" fill="#f6ffff">searchRecipes</text>
<text xml:space="preserve" text-anchor="start" x="2226.31" y="-1158.4" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;unit&#45;tests</text>
<text xml:space="preserve" text-anchor="start" x="2226.31" y="-1140.4" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;unit (respawn)</text>
</g>
<!-- t_epicreview -->
<g id="node20" class="node">
<title>t_epicreview</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="706.72,-288 353.28,-288 353.28,-108 706.72,-108 706.72,-288"/>
<text xml:space="preserve" text-anchor="start" x="401.4" y="-192.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="445.34" y="-237" font-family="Arial" font-size="20.00" fill="#ffffff">epic&#45;review (RECIPE&#45;4)</text>
<text xml:space="preserve" text-anchor="start" x="684.71" y="-192.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="445.34" y="-214" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="445.34" y="-196" font-family="Arial" font-size="15.00" fill="#f6ffff">the three questions over the whole</text>
<text xml:space="preserve" text-anchor="start" x="445.34" y="-178" font-family="Arial" font-size="15.00" fill="#f6ffff">epic</text>
<text xml:space="preserve" text-anchor="start" x="445.34" y="-160" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;epic&#45;review</text>
<text xml:space="preserve" text-anchor="start" x="445.34" y="-142" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: review (respawn)</text>
</g>
<!-- t_fronta -->
<g id="node21" class="node">
<title>t_fronta</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="1476.33,-953.6 1121.67,-953.6 1121.67,-773.6 1476.33,-773.6 1476.33,-953.6"/>
<text xml:space="preserve" text-anchor="start" x="1169.79" y="-858" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1213.74" y="-902.6" font-family="Arial" font-size="20.00" fill="#ffffff">frontend&#45;ui (RECIPE&#45;8)</text>
<text xml:space="preserve" text-anchor="start" x="1454.32" y="-858" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1213.74" y="-879.6" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="1213.74" y="-861.6" font-family="Arial" font-size="15.00" fill="#f6ffff">RecipeForm + RecipeCard against</text>
<text xml:space="preserve" text-anchor="start" x="1213.74" y="-843.6" font-family="Arial" font-size="15.00" fill="#f6ffff">proved functions</text>
<text xml:space="preserve" text-anchor="start" x="1213.74" y="-825.6" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;frontend&#45;ui</text>
<text xml:space="preserve" text-anchor="start" x="1213.74" y="-807.6" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: frontend</text>
</g>
<!-- t_frontb -->
<g id="node22" class="node">
<title>t_frontb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="2473.99,-953.6 2132.01,-953.6 2132.01,-773.6 2473.99,-773.6 2473.99,-953.6"/>
<text xml:space="preserve" text-anchor="start" x="2180.12" y="-858" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2224.07" y="-902.6" font-family="Arial" font-size="20.00" fill="#ffffff">frontend&#45;ui (RECIPE&#45;14)</text>
<text xml:space="preserve" text-anchor="start" x="2451.99" y="-858" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2224.07" y="-879.6" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="2224.07" y="-861.6" font-family="Arial" font-size="15.00" fill="#f6ffff">SearchBar + live results list</text>
<text xml:space="preserve" text-anchor="start" x="2224.07" y="-843.6" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;frontend&#45;ui</text>
<text xml:space="preserve" text-anchor="start" x="2224.07" y="-825.6" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: frontend</text>
<text xml:space="preserve" text-anchor="start" x="2224.07" y="-807.6" font-family="Arial" font-size="15.00" fill="#f6ffff">category: frontend&#45;ux</text>
</g>
<!-- t_ftesta -->
<g id="node23" class="node">
<title>t_ftesta</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="1470.21,-620.8 1133.79,-620.8 1133.79,-440.8 1470.21,-440.8 1470.21,-620.8"/>
<text xml:space="preserve" text-anchor="start" x="1181.91" y="-525.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1225.86" y="-569.8" font-family="Arial" font-size="20.00" fill="#ffffff">feature&#45;test (RECIPE&#45;9)</text>
<text xml:space="preserve" text-anchor="start" x="1448.2" y="-525.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1225.86" y="-546.8" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="1225.86" y="-528.8" font-family="Arial" font-size="15.00" fill="#f6ffff">the add&#45;recipe pieces are wired</text>
<text xml:space="preserve" text-anchor="start" x="1225.86" y="-510.8" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;feature&#45;test</text>
<text xml:space="preserve" text-anchor="start" x="1225.86" y="-492.8" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;feature (respawn)</text>
<text xml:space="preserve" text-anchor="start" x="1225.86" y="-474.8" font-family="Arial" font-size="15.00" fill="#f6ffff">category: feature&#45;test</text>
</g>
<!-- t_ftestb -->
<g id="node24" class="node">
<title>t_ftestb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="2480.77,-620.8 2133.23,-620.8 2133.23,-440.8 2480.77,-440.8 2480.77,-620.8"/>
<text xml:space="preserve" text-anchor="start" x="2181.35" y="-525.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2225.3" y="-569.8" font-family="Arial" font-size="20.00" fill="#ffffff">feature&#45;test (RECIPE&#45;15)</text>
<text xml:space="preserve" text-anchor="start" x="2458.76" y="-525.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2225.3" y="-546.8" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="2225.3" y="-528.8" font-family="Arial" font-size="15.00" fill="#f6ffff">the search pieces are wired</text>
<text xml:space="preserve" text-anchor="start" x="2225.3" y="-510.8" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;feature&#45;test</text>
<text xml:space="preserve" text-anchor="start" x="2225.3" y="-492.8" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;feature (respawn)</text>
<text xml:space="preserve" text-anchor="start" x="2225.3" y="-474.8" font-family="Arial" font-size="15.00" fill="#f6ffff">category: feature&#45;test</text>
</g>
<!-- t_freva -->
<g id="node25" class="node">
<title>t_freva</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="1727.55,-288 1354.45,-288 1354.45,-108 1727.55,-108 1727.55,-288"/>
<text xml:space="preserve" text-anchor="start" x="1402.57" y="-192.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1446.52" y="-237" font-family="Arial" font-size="20.00" fill="#ffffff">feature&#45;review (RECIPE&#45;10)</text>
<text xml:space="preserve" text-anchor="start" x="1705.54" y="-192.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1446.52" y="-214" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="1446.52" y="-196" font-family="Arial" font-size="15.00" fill="#f6ffff">the three questions over</text>
<text xml:space="preserve" text-anchor="start" x="1446.52" y="-178" font-family="Arial" font-size="15.00" fill="#f6ffff">feature/add&#45;recipe</text>
<text xml:space="preserve" text-anchor="start" x="1446.52" y="-160" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;feature&#45;review</text>
<text xml:space="preserve" text-anchor="start" x="1446.52" y="-142" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: review (respawn)</text>
</g>
<!-- t_frevb -->
<g id="node26" class="node">
<title>t_frevb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="2735.55,-288 2362.45,-288 2362.45,-108 2735.55,-108 2735.55,-288"/>
<text xml:space="preserve" text-anchor="start" x="2410.57" y="-192.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2454.52" y="-237" font-family="Arial" font-size="20.00" fill="#ffffff">feature&#45;review (RECIPE&#45;16)</text>
<text xml:space="preserve" text-anchor="start" x="2713.54" y="-192.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2454.52" y="-214" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="2454.52" y="-196" font-family="Arial" font-size="15.00" fill="#f6ffff">the three questions over</text>
<text xml:space="preserve" text-anchor="start" x="2454.52" y="-178" font-family="Arial" font-size="15.00" fill="#f6ffff">feature/search&#45;recipes</text>
<text xml:space="preserve" text-anchor="start" x="2454.52" y="-160" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;feature&#45;review</text>
<text xml:space="preserve" text-anchor="start" x="2454.52" y="-142" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: review (respawn)</text>
</g>
<!-- mergerun&#45;&gt;t_merge -->
<g id="edge1" class="edge">
<title>mergerun&#45;&gt;t_merge</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M290,-1106.75C290,-1062.72 290,-1009.36 290,-963.95"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="292.63,-964.02 290,-956.52 287.38,-964.02 292.63,-964.02"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="290,-1018.6 290,-1041.4 411.92,-1041.4 411.92,-1018.6 290,-1018.6"/>
<text xml:space="preserve" text-anchor="start" x="293" y="-1024.4" font-family="Arial" font-size="14.00" fill="#ffffff">works — assemble</text>
</g>
<!-- e2erun&#45;&gt;t_e2e -->
<g id="edge2" class="edge">
<title>e2erun&#45;&gt;t_e2e</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M641.44,-773.73C574.57,-728.22 493.13,-672.79 425.09,-626.47"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="426.61,-624.33 418.94,-622.28 423.66,-628.67 426.61,-624.33"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="543.57,-685.8 543.57,-708.6 658.5,-708.6 658.5,-685.8 543.57,-685.8"/>
<text xml:space="preserve" text-anchor="start" x="546.57" y="-691.6" font-family="Arial" font-size="14.00" fill="#ffffff">works — journeys</text>
</g>
<!-- epicreviewrun&#45;&gt;t_epicreview -->
<g id="edge3" class="edge">
<title>epicreviewrun&#45;&gt;t_epicreview</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M708.61,-441.15C675.66,-396.47 635.62,-342.19 601.81,-296.35"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="603.93,-294.81 597.36,-290.33 599.7,-297.92 603.93,-294.81"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="659.32,-353 659.32,-375.8 809.23,-375.8 809.23,-353 659.32,-353"/>
<text xml:space="preserve" text-anchor="start" x="662.32" y="-358.8" font-family="Arial" font-size="14.00" fill="#ffffff">works — PR comments</text>
</g>
<!-- enga&#45;&gt;t_backenda -->
<g id="edge6" class="edge">
<title>enga&#45;&gt;t_backenda</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M1288,-1786.55C1288,-1742.52 1288,-1689.16 1288,-1643.75"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="1290.63,-1643.82 1288,-1636.32 1285.38,-1643.82 1290.63,-1643.82"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1288,-1698.4 1288,-1721.2 1422.37,-1721.2 1422.37,-1698.4 1288,-1698.4"/>
<text xml:space="preserve" text-anchor="start" x="1291" y="-1704.2" font-family="Arial" font-size="14.00" fill="#ffffff">works — one commit</text>
</g>
<!-- unita&#45;&gt;t_unita -->
<g id="edge7" class="edge">
<title>unita&#45;&gt;t_unita</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M1652.74,-1453.45C1608.93,-1423.16 1559.76,-1389.02 1515,-1357.6 1485.05,-1336.57 1452.95,-1313.84 1422.66,-1292.29"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="1424.26,-1290.22 1416.63,-1288.01 1421.22,-1294.49 1424.26,-1290.22"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1558.54,-1365.6 1558.54,-1388.4 1692.11,-1388.4 1692.11,-1365.6 1558.54,-1365.6"/>
<text xml:space="preserve" text-anchor="start" x="1561.54" y="-1371.4" font-family="Arial" font-size="14.00" fill="#ffffff">works — test commit</text>
</g>
<!-- fea&#45;&gt;t_fronta -->
<g id="edge8" class="edge">
<title>fea&#45;&gt;t_fronta</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M1628.11,-1106.53C1566.32,-1061.11 1491.1,-1005.81 1428.17,-959.56"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="1429.81,-957.5 1422.21,-955.17 1426.7,-961.73 1429.81,-957.5"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1537.49,-1018.6 1537.49,-1041.4 1662.5,-1041.4 1662.5,-1018.6 1537.49,-1018.6"/>
<text xml:space="preserve" text-anchor="start" x="1540.49" y="-1024.4" font-family="Arial" font-size="14.00" fill="#ffffff">works — UI commit</text>
</g>
<!-- fta&#45;&gt;t_ftesta -->
<g id="edge9" class="edge">
<title>fta&#45;&gt;t_ftesta</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M1653.05,-773.73C1587.01,-728.22 1506.58,-672.79 1439.37,-626.47"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="1440.98,-624.39 1433.32,-622.3 1438,-628.72 1440.98,-624.39"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1556.39,-685.8 1556.39,-708.6 1647.97,-708.6 1647.97,-685.8 1556.39,-685.8"/>
<text xml:space="preserve" text-anchor="start" x="1559.39" y="-691.6" font-family="Arial" font-size="14.00" fill="#ffffff">works — suite</text>
</g>
<!-- reva&#45;&gt;t_freva -->
<g id="edge10" class="edge">
<title>reva&#45;&gt;t_freva</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M1715.95,-441.15C1683.67,-396.47 1644.45,-342.19 1611.33,-296.35"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="1613.52,-294.89 1607,-290.35 1609.26,-297.96 1613.52,-294.89"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1667.67,-353 1667.67,-375.8 1817.58,-375.8 1817.58,-353 1667.67,-353"/>
<text xml:space="preserve" text-anchor="start" x="1670.67" y="-358.8" font-family="Arial" font-size="14.00" fill="#ffffff">works — PR comments</text>
</g>
<!-- engb&#45;&gt;t_backendb -->
<g id="edge15" class="edge">
<title>engb&#45;&gt;t_backendb</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M2297,-1786.55C2297,-1742.52 2297,-1689.16 2297,-1643.75"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="2299.63,-1643.82 2297,-1636.32 2294.38,-1643.82 2299.63,-1643.82"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2297,-1698.4 2297,-1721.2 2431.37,-1721.2 2431.37,-1698.4 2297,-1698.4"/>
<text xml:space="preserve" text-anchor="start" x="2300" y="-1704.2" font-family="Arial" font-size="14.00" fill="#ffffff">works — one commit</text>
</g>
<!-- unitb&#45;&gt;t_unitb -->
<g id="edge16" class="edge">
<title>unitb&#45;&gt;t_unitb</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M2664.6,-1453.61C2620.96,-1423.18 2571.83,-1388.91 2527,-1357.6 2496.73,-1336.46 2464.22,-1313.73 2433.48,-1292.23"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="2434.99,-1290.08 2427.34,-1287.93 2431.98,-1294.38 2434.99,-1290.08"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2570.35,-1365.6 2570.35,-1388.4 2703.92,-1388.4 2703.92,-1365.6 2570.35,-1365.6"/>
<text xml:space="preserve" text-anchor="start" x="2573.35" y="-1371.4" font-family="Arial" font-size="14.00" fill="#ffffff">works — test commit</text>
</g>
<!-- feb&#45;&gt;t_frontb -->
<g id="edge17" class="edge">
<title>feb&#45;&gt;t_frontb</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M2637.96,-1106.53C2574.95,-1061.02 2498.2,-1005.59 2434.08,-959.27"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="2435.99,-957.42 2428.37,-955.15 2432.92,-961.67 2435.99,-957.42"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2545.73,-1018.6 2545.73,-1041.4 2670.74,-1041.4 2670.74,-1018.6 2545.73,-1018.6"/>
<text xml:space="preserve" text-anchor="start" x="2548.73" y="-1024.4" font-family="Arial" font-size="14.00" fill="#ffffff">works — UI commit</text>
</g>
<!-- ftb&#45;&gt;t_ftestb -->
<g id="edge18" class="edge">
<title>ftb&#45;&gt;t_ftestb</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M2652.93,-773.73C2587.86,-728.22 2508.59,-672.79 2442.37,-626.47"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="2444.08,-624.46 2436.43,-622.32 2441.07,-628.77 2444.08,-624.46"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2557.68,-685.8 2557.68,-708.6 2649.26,-708.6 2649.26,-685.8 2557.68,-685.8"/>
<text xml:space="preserve" text-anchor="start" x="2560.68" y="-691.6" font-family="Arial" font-size="14.00" fill="#ffffff">works — suite</text>
</g>
<!-- revb&#45;&gt;t_frevb -->
<g id="edge19" class="edge">
<title>revb&#45;&gt;t_frevb</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M2726.15,-441.15C2693.46,-396.47 2653.75,-342.19 2620.22,-296.35"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="2622.36,-294.84 2615.82,-290.34 2618.13,-297.94 2622.36,-294.84"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2677.26,-353 2677.26,-375.8 2827.17,-375.8 2827.17,-353 2677.26,-353"/>
<text xml:space="preserve" text-anchor="start" x="2680.26" y="-358.8" font-family="Arial" font-size="14.00" fill="#ffffff">works — PR comments</text>
</g>
<!-- t_merge&#45;&gt;t_e2e -->
<g id="edge4" class="edge">
<title>t_merge&#45;&gt;t_e2e</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M288.93,-773.95C288.4,-729.92 287.75,-676.56 287.2,-631.15"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="289.83,-631.19 287.11,-623.72 284.58,-631.25 289.83,-631.19"/>
</g>
<!-- t_backenda&#45;&gt;t_unita -->
<g id="edge11" class="edge">
<title>t_backenda&#45;&gt;t_unita</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M1288.52,-1453.55C1288.79,-1405.56 1289.14,-1346.16 1289.42,-1296.65"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="1292.05,-1296.79 1289.47,-1289.27 1286.8,-1296.76 1292.05,-1296.79"/>
</g>
<!-- t_backendb&#45;&gt;t_unitb -->
<g id="edge20" class="edge">
<title>t_backendb&#45;&gt;t_unitb</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M2297.26,-1453.55C2297.4,-1405.56 2297.57,-1346.16 2297.71,-1296.65"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="2300.34,-1296.78 2297.73,-1289.27 2295.09,-1296.76 2300.34,-1296.78"/>
</g>
<!-- t_e2e&#45;&gt;t_epicreview -->
<g id="edge5" class="edge">
<title>t_e2e&#45;&gt;t_epicreview</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M351.39,-441.15C384.34,-396.47 424.38,-342.19 458.19,-296.35"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="460.3,-297.92 462.64,-290.33 456.07,-294.81 460.3,-297.92"/>
</g>
<!-- t_unita&#45;&gt;t_fronta -->
<g id="edge12" class="edge">
<title>t_unita&#45;&gt;t_fronta</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M1292.41,-1106.75C1293.61,-1062.72 1295.06,-1009.36 1296.3,-963.95"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="1298.92,-964.09 1296.5,-956.52 1293.67,-963.94 1298.92,-964.09"/>
</g>
<!-- t_unitb&#45;&gt;t_frontb -->
<g id="edge21" class="edge">
<title>t_unitb&#45;&gt;t_frontb</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M2299.34,-1106.75C2300.01,-1062.72 2300.81,-1009.36 2301.5,-963.95"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="2304.12,-964.06 2301.61,-956.52 2298.87,-963.98 2304.12,-964.06"/>
</g>
<!-- t_fronta&#45;&gt;t_ftesta -->
<g id="edge13" class="edge">
<title>t_fronta&#45;&gt;t_ftesta</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M1299.8,-773.95C1300.2,-729.92 1300.69,-676.56 1301.1,-631.15"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="1303.72,-631.24 1301.17,-623.72 1298.47,-631.2 1303.72,-631.24"/>
</g>
<!-- t_frontb&#45;&gt;t_ftestb -->
<g id="edge22" class="edge">
<title>t_frontb&#45;&gt;t_ftestb</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M2304.07,-773.95C2304.6,-729.92 2305.25,-676.56 2305.8,-631.15"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="2308.42,-631.25 2305.89,-623.72 2303.17,-631.19 2308.42,-631.25"/>
</g>
<!-- t_ftesta&#45;&gt;t_freva -->
<g id="edge14" class="edge">
<title>t_ftesta&#45;&gt;t_freva</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M1366.05,-441.15C1398.33,-396.47 1437.55,-342.19 1470.67,-296.35"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="1472.74,-297.96 1475,-290.35 1468.48,-294.89 1472.74,-297.96"/>
</g>
<!-- t_ftestb&#45;&gt;t_frevb -->
<g id="edge23" class="edge">
<title>t_ftestb&#45;&gt;t_frevb</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M2371.85,-441.15C2404.54,-396.47 2444.25,-342.19 2477.78,-296.35"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="2479.87,-297.94 2482.18,-290.34 2475.64,-294.84 2479.87,-297.94"/>
</g>
</g>
</svg>
`;case`planTower`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 16.1.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="2704pt" height="924pt"
 viewBox="0.00 0.00 2704.00 924.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 909.05)">
<!-- human -->
<g id="node1" class="node">
<title>human</title>
<polygon fill="#6b7280" stroke="#484f5c" stroke-width="0" points="354.24,-662 0,-662 0,-482 354.24,-482 354.24,-662"/>
<text xml:space="preserve" text-anchor="start" x="48.12" y="-566.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-611" font-family="Arial" font-size="20.00" fill="#ffffff">Human (Brodie)</text>
<text xml:space="preserve" text-anchor="start" x="332.23" y="-566.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-588" font-family="Arial" font-size="15.00" fill="#fdffff">What it is: the only one who closes</text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-570" font-family="Arial" font-size="15.00" fill="#fdffff">gates. Workers leave their tickets</text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-552" font-family="Arial" font-size="15.00" fill="#fdffff">open and report in their final</text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-534" font-family="Arial" font-size="15.00" fill="#fdffff">message; the human reads the</text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-516" font-family="Arial" font-size="15.00" fill="#fdffff">report, verifies the branch, and</text>
</g>
<!-- planepic -->
<g id="node2" class="node">
<title>planepic</title>
<polygon fill="#0891b2" stroke="#006c8c" stroke-width="0" points="1133.01,-470 768.75,-470 768.75,-290 1133.01,-290 1133.01,-470"/>
<text xml:space="preserve" text-anchor="start" x="816.87" y="-374.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="860.82" y="-419" font-family="Arial" font-size="20.00" fill="#ffffff">plan&#45;epic</text>
<text xml:space="preserve" text-anchor="start" x="1111" y="-374.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="860.82" y="-396" font-family="Arial" font-size="15.00" fill="#f9ffff">What it is: conversational epic</text>
<text xml:space="preserve" text-anchor="start" x="860.82" y="-378" font-family="Arial" font-size="15.00" fill="#f9ffff">architect — vague idea → clarifying</text>
<text xml:space="preserve" text-anchor="start" x="860.82" y="-360" font-family="Arial" font-size="15.00" fill="#f9ffff">questions → research → exactly one</text>
<text xml:space="preserve" text-anchor="start" x="860.82" y="-342" font-family="Arial" font-size="15.00" fill="#f9ffff">epic gate plus epic&#45;merge&#45;pr,</text>
<text xml:space="preserve" text-anchor="start" x="860.82" y="-324" font-family="Arial" font-size="15.00" fill="#f9ffff">epic&#45;e2e&#45;test, epic&#45;review. Writes</text>
</g>
<!-- beads -->
<g id="node3" class="node">
<title>beads</title>
<path fill="#6b7280" stroke="#484f5c" stroke-width="2" d="M1893.88,-453.64C1893.88,-462.67 1813.56,-470 1714.68,-470 1615.79,-470 1535.47,-462.67 1535.47,-453.64 1535.47,-453.64 1535.47,-306.36 1535.47,-306.36 1535.47,-297.33 1615.79,-290 1714.68,-290 1813.56,-290 1893.88,-297.33 1893.88,-306.36 1893.88,-306.36 1893.88,-453.64 1893.88,-453.64"/>
<path fill="none" stroke="#484f5c" stroke-width="2" d="M1893.88,-453.64C1893.88,-444.61 1813.56,-437.27 1714.68,-437.27 1615.79,-437.27 1535.47,-444.61 1535.47,-453.64"/>
<text xml:space="preserve" text-anchor="start" x="1583.59" y="-374.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1627.53" y="-419" font-family="Arial" font-size="20.00" fill="#ffffff">beads DB (bd)</text>
<text xml:space="preserve" text-anchor="start" x="1871.87" y="-374.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1627.53" y="-396" font-family="Arial" font-size="15.00" fill="#fdffff">What it is: the beads issue</text>
<text xml:space="preserve" text-anchor="start" x="1627.53" y="-378" font-family="Arial" font-size="15.00" fill="#fdffff">database — the loop&#39;s only runtime</text>
<text xml:space="preserve" text-anchor="start" x="1627.53" y="-360" font-family="Arial" font-size="15.00" fill="#fdffff">input. None of the contract docs</text>
<text xml:space="preserve" text-anchor="start" x="1627.53" y="-342" font-family="Arial" font-size="15.00" fill="#fdffff">are read at runtime; the graph</text>
<text xml:space="preserve" text-anchor="start" x="1627.53" y="-324" font-family="Arial" font-size="15.00" fill="#fdffff">lives here.Verbs the tower uses: bd</text>
</g>
<!-- planfeature -->
<g id="node4" class="node">
<title>planfeature</title>
<polygon fill="#0891b2" stroke="#006c8c" stroke-width="0" points="2671.96,-894 2321.05,-894 2321.05,-714 2671.96,-714 2671.96,-894"/>
<text xml:space="preserve" text-anchor="start" x="2369.17" y="-798.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2413.12" y="-843" font-family="Arial" font-size="20.00" fill="#ffffff">plan&#45;feature</text>
<text xml:space="preserve" text-anchor="start" x="2649.95" y="-798.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2413.12" y="-820" font-family="Arial" font-size="15.00" fill="#f9ffff">What it is: breaks an epic into</text>
<text xml:space="preserve" text-anchor="start" x="2413.12" y="-802" font-family="Arial" font-size="15.00" fill="#f9ffff">feature&#45;sized features — complete</text>
<text xml:space="preserve" text-anchor="start" x="2413.12" y="-784" font-family="Arial" font-size="15.00" fill="#f9ffff">user&#45;facing flows — each with its</text>
<text xml:space="preserve" text-anchor="start" x="2413.12" y="-766" font-family="Arial" font-size="15.00" fill="#f9ffff">own feature/&lt;slug&gt; branch, its</text>
<text xml:space="preserve" text-anchor="start" x="2413.12" y="-748" font-family="Arial" font-size="15.00" fill="#f9ffff">feature&#45;test and feature&#45;review</text>
</g>
<!-- plantask -->
<g id="node5" class="node">
<title>plantask</title>
<polygon fill="#0891b2" stroke="#006c8c" stroke-width="0" points="2674.03,-550 2318.98,-550 2318.98,-370 2674.03,-370 2674.03,-550"/>
<text xml:space="preserve" text-anchor="start" x="2367.1" y="-454.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2411.04" y="-499" font-family="Arial" font-size="20.00" fill="#ffffff">plan&#45;task</text>
<text xml:space="preserve" text-anchor="start" x="2652.02" y="-454.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2411.04" y="-476" font-family="Arial" font-size="15.00" fill="#f9ffff">What it is: breaks ONE feature into</text>
<text xml:space="preserve" text-anchor="start" x="2411.04" y="-458" font-family="Arial" font-size="15.00" fill="#f9ffff">tasks, each parent&#45;child to the</text>
<text xml:space="preserve" text-anchor="start" x="2411.04" y="-440" font-family="Arial" font-size="15.00" fill="#f9ffff">feature, labeled at creation with</text>
<text xml:space="preserve" text-anchor="start" x="2411.04" y="-422" font-family="Arial" font-size="15.00" fill="#f9ffff">bd create &#45;l &lt;label&gt;, the feature&#39;s</text>
<text xml:space="preserve" text-anchor="start" x="2411.04" y="-404" font-family="Arial" font-size="15.00" fill="#f9ffff">branch copied verbatim (a plan</text>
</g>
<!-- dispatcher -->
<g id="node6" class="node">
<title>dispatcher</title>
<polygon fill="#2563eb" stroke="#0042c2" stroke-width="0" points="1149.61,-180 752.15,-180 752.15,0 1149.61,0 1149.61,-180"/>
<text xml:space="preserve" text-anchor="start" x="820.21" y="-84.4" font-family="Arial" font-size="14.00" fill="#f1ffff"> </text>
<text xml:space="preserve" text-anchor="start" x="864.16" y="-129" font-family="Arial" font-size="20.00" fill="#f1ffff">bo loop — the dispatcher</text>
<text xml:space="preserve" text-anchor="start" x="1107.66" y="-84.4" font-family="Arial" font-size="14.00" fill="#f1ffff"> </text>
<text xml:space="preserve" text-anchor="start" x="864.16" y="-106" font-family="Arial" font-size="15.00" fill="#ddf2ff">What it is: CLI/beads&#45;loop.sh — the</text>
<text xml:space="preserve" text-anchor="start" x="864.16" y="-88" font-family="Arial" font-size="15.00" fill="#ddf2ff">one command (bo loop) that turns</text>
<text xml:space="preserve" text-anchor="start" x="864.16" y="-70" font-family="Arial" font-size="15.00" fill="#ddf2ff">beads tickets into background</text>
<text xml:space="preserve" text-anchor="start" x="864.16" y="-52" font-family="Arial" font-size="15.00" fill="#ddf2ff">workers.Steps it runs, one per</text>
<text xml:space="preserve" text-anchor="start" x="864.16" y="-34" font-family="Arial" font-size="15.00" fill="#ddf2ff">tick:reads the branches already at</text>
</g>
<!-- human&#45;&gt;planepic -->
<g id="edge1" class="edge">
<title>human&#45;&gt;planepic</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M354.21,-528.19C474.95,-498.15 635.06,-458.32 758.88,-427.52"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="759.27,-430.13 765.92,-425.77 758,-425.03 759.27,-430.13"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="424.66,-512.9 424.66,-545.7 448.66,-545.7 448.66,-512.9 424.66,-512.9"/>
<text xml:space="preserve" text-anchor="start" x="432.77" y="-526.1" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">0</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="451.66,-512.9 451.66,-545.7 681.73,-545.7 681.73,-512.9 451.66,-512.9"/>
<text xml:space="preserve" text-anchor="start" x="454.66" y="-523.7" font-family="Arial" font-size="14.00" fill="#c9c9c9">&#39;a recipe box app&#39; — one vague idea</text>
</g>
<!-- human&#45;&gt;planfeature -->
<g id="edge3" class="edge">
<title>human&#45;&gt;planfeature</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M315.45,-661.96C346.82,-678.87 380.79,-694.52 414.24,-705 558.19,-750.11 601.63,-726.99 752.15,-737 1319.64,-774.75 1992.57,-793.17 2310.95,-800.3"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2310.61,-802.92 2318.17,-800.46 2310.73,-797.67 2310.61,-802.92"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1229.55,-777.17 1229.55,-809.97 1253.55,-809.97 1253.55,-777.17 1229.55,-777.17"/>
<text xml:space="preserve" text-anchor="start" x="1237.65" y="-790.37" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1256.55,-777.17 1256.55,-809.97 1455.53,-809.97 1455.53,-777.17 1256.55,-777.17"/>
<text xml:space="preserve" text-anchor="start" x="1259.55" y="-787.97" font-family="Arial" font-size="14.00" fill="#c9c9c9">plan the features for RECIPE&#45;1</text>
</g>
<!-- human&#45;&gt;plantask -->
<g id="edge5" class="edge">
<title>human&#45;&gt;plantask</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M354.13,-598.98C716.44,-648.73 1569.45,-735.98 2258.98,-576 2281.69,-570.73 2304.73,-562.96 2327.07,-553.9"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2327.89,-556.4 2333.8,-551.1 2325.87,-551.55 2327.89,-556.4"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1238.5,-670.87 1238.5,-703.67 1262.5,-703.67 1262.5,-670.87 1238.5,-670.87"/>
<text xml:space="preserve" text-anchor="start" x="1246.61" y="-684.07" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1265.5,-670.87 1265.5,-703.67 1446.58,-703.67 1446.58,-670.87 1265.5,-670.87"/>
<text xml:space="preserve" text-anchor="start" x="1268.5" y="-681.67" font-family="Arial" font-size="14.00" fill="#c9c9c9">plan the tasks for RECIPE&#45;5</text>
</g>
<!-- human&#45;&gt;dispatcher -->
<g id="edge7" class="edge">
<title>human&#45;&gt;dispatcher</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M276.84,-482.09C317.85,-446.82 366.87,-407.25 414.24,-375.4 520.34,-304.06 646.2,-236.23 749.24,-184.61"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="750.27,-187.04 755.8,-181.34 747.92,-182.34 750.27,-187.04"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="417.24,-378.4 417.24,-418 441.24,-418 441.24,-378.4 417.24,-378.4"/>
<text xml:space="preserve" text-anchor="start" x="425.35" y="-395" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="444.24,-378.4 444.24,-418 689.15,-418 689.15,-378.4 444.24,-378.4"/>
<text xml:space="preserve" text-anchor="start" x="447.24" y="-401" font-family="Arial" font-size="14.00" fill="#c9c9c9">bo loop — and the tower starts walking</text>
<text xml:space="preserve" text-anchor="start" x="552.3" y="-384.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">itself</text>
</g>
<!-- planepic&#45;&gt;beads -->
<g id="edge2" class="edge">
<title>planepic&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1132.9,-380C1250.91,-380 1404.64,-380 1524.29,-380"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1524.13,-382.63 1531.63,-380 1524.13,-377.38 1524.13,-382.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1212.61,-383 1212.61,-439.4 1236.61,-439.4 1236.61,-383 1212.61,-383"/>
<text xml:space="preserve" text-anchor="start" x="1220.72" y="-408" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1239.61,-383 1239.61,-439.4 1472.47,-439.4 1472.47,-383 1239.61,-383"/>
<text xml:space="preserve" text-anchor="start" x="1243.99" y="-422.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">clarify, research, then create exactly</text>
<text xml:space="preserve" text-anchor="start" x="1242.61" y="-405.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">one epic gate + merge / e2e / review</text>
<text xml:space="preserve" text-anchor="start" x="1336.2" y="-388.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">tickets</text>
</g>
<!-- beads&#45;&gt;planfeature -->
<g id="edge4" class="edge">
<title>beads&#45;&gt;planfeature</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1882.04,-470.46C2014.19,-542.3 2198.07,-642.28 2330,-714.01"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1883.52,-468.27 1875.68,-466.99 1881.01,-472.88 1883.52,-468.27"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1963.09,-669.85 1963.09,-726.25 1987.09,-726.25 1987.09,-669.85 1963.09,-669.85"/>
<text xml:space="preserve" text-anchor="start" x="1971.2" y="-694.85" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1990.09,-669.85 1990.09,-726.25 2249.77,-726.25 2249.77,-669.85 1990.09,-669.85"/>
<text xml:space="preserve" text-anchor="start" x="2015.26" y="-709.25" font-family="Arial" font-size="14.00" fill="#c9c9c9">RECIPE&#45;5 feature/add&#45;recipe and</text>
<text xml:space="preserve" text-anchor="start" x="1993.09" y="-692.45" font-family="Arial" font-size="14.00" fill="#c9c9c9">RECIPE&#45;11 feature/search&#45;recipes, each</text>
<text xml:space="preserve" text-anchor="start" x="2010.21" y="-675.65" font-family="Arial" font-size="14.00" fill="#c9c9c9">with feature&#45;test and feature&#45;review</text>
</g>
<!-- beads&#45;&gt;plantask -->
<g id="edge6" class="edge">
<title>beads&#45;&gt;plantask</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1904.71,-331.64C2010.33,-312.32 2143.53,-300.85 2258.98,-330.4 2292.89,-339.08 2327.16,-353.74 2358.69,-370.15"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1904.45,-329.02 1897.56,-332.97 1905.41,-334.18 1904.45,-329.02"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1956.88,-333.4 1956.88,-373 1980.88,-373 1980.88,-333.4 1956.88,-333.4"/>
<text xml:space="preserve" text-anchor="start" x="1964.99" y="-350" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1983.88,-333.4 1983.88,-373 2255.98,-373 2255.98,-333.4 1983.88,-333.4"/>
<text xml:space="preserve" text-anchor="start" x="1986.88" y="-356" font-family="Arial" font-size="14.00" fill="#c9c9c9">RECIPE&#45;6, RECIPE&#45;7, RECIPE&#45;8, chained</text>
<text xml:space="preserve" text-anchor="start" x="2073.62" y="-339.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">one to the next</text>
</g>
</g>
</svg>
`;case`tickWalkthrough`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 16.1.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1341pt" height="3952pt"
 viewBox="0.00 0.00 1341.00 3952.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 3936.95)">
<!-- dispatcher -->
<g id="node1" class="node">
<title>dispatcher</title>
<polygon fill="#2563eb" stroke="#0042c2" stroke-width="0" points="397.46,-2432 0,-2432 0,-2252 397.46,-2252 397.46,-2432"/>
<text xml:space="preserve" text-anchor="start" x="68.06" y="-2336.4" font-family="Arial" font-size="14.00" fill="#f1ffff"> </text>
<text xml:space="preserve" text-anchor="start" x="112.01" y="-2381" font-family="Arial" font-size="20.00" fill="#f1ffff">bo loop — the dispatcher</text>
<text xml:space="preserve" text-anchor="start" x="355.51" y="-2336.4" font-family="Arial" font-size="14.00" fill="#f1ffff"> </text>
<text xml:space="preserve" text-anchor="start" x="112.01" y="-2358" font-family="Arial" font-size="15.00" fill="#ddf2ff">What it is: CLI/beads&#45;loop.sh — the</text>
<text xml:space="preserve" text-anchor="start" x="112.01" y="-2340" font-family="Arial" font-size="15.00" fill="#ddf2ff">one command (bo loop) that turns</text>
<text xml:space="preserve" text-anchor="start" x="112.01" y="-2322" font-family="Arial" font-size="15.00" fill="#ddf2ff">beads tickets into background</text>
<text xml:space="preserve" text-anchor="start" x="112.01" y="-2304" font-family="Arial" font-size="15.00" fill="#ddf2ff">workers.Steps it runs, one per</text>
<text xml:space="preserve" text-anchor="start" x="112.01" y="-2286" font-family="Arial" font-size="15.00" fill="#ddf2ff">tick:reads the branches already at</text>
</g>
<!-- beads -->
<g id="node2" class="node">
<title>beads</title>
<path fill="#6b7280" stroke="#484f5c" stroke-width="2" d="M1254.18,-3254.64C1254.18,-3263.67 1173.86,-3271 1074.97,-3271 976.09,-3271 895.77,-3263.67 895.77,-3254.64 895.77,-3254.64 895.77,-3107.36 895.77,-3107.36 895.77,-3098.33 976.09,-3091 1074.97,-3091 1173.86,-3091 1254.18,-3098.33 1254.18,-3107.36 1254.18,-3107.36 1254.18,-3254.64 1254.18,-3254.64"/>
<path fill="none" stroke="#484f5c" stroke-width="2" d="M1254.18,-3254.64C1254.18,-3245.61 1173.86,-3238.27 1074.97,-3238.27 976.09,-3238.27 895.77,-3245.61 895.77,-3254.64"/>
<text xml:space="preserve" text-anchor="start" x="943.89" y="-3175.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="987.83" y="-3220" font-family="Arial" font-size="20.00" fill="#ffffff">beads DB (bd)</text>
<text xml:space="preserve" text-anchor="start" x="1232.17" y="-3175.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="987.83" y="-3197" font-family="Arial" font-size="15.00" fill="#fdffff">What it is: the beads issue</text>
<text xml:space="preserve" text-anchor="start" x="987.83" y="-3179" font-family="Arial" font-size="15.00" fill="#fdffff">database — the loop&#39;s only runtime</text>
<text xml:space="preserve" text-anchor="start" x="987.83" y="-3161" font-family="Arial" font-size="15.00" fill="#fdffff">input. None of the contract docs</text>
<text xml:space="preserve" text-anchor="start" x="987.83" y="-3143" font-family="Arial" font-size="15.00" fill="#fdffff">are read at runtime; the graph</text>
<text xml:space="preserve" text-anchor="start" x="987.83" y="-3125" font-family="Arial" font-size="15.00" fill="#fdffff">lives here.Verbs the tower uses: bd</text>
</g>
<!-- engineer -->
<g id="node3" class="node">
<title>engineer</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="1252.93,-2500 897.02,-2500 897.02,-2320 1252.93,-2320 1252.93,-2500"/>
<text xml:space="preserve" text-anchor="start" x="945.14" y="-2404.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="989.09" y="-2449" font-family="Arial" font-size="20.00" fill="#ffffff">engineer</text>
<text xml:space="preserve" text-anchor="start" x="1230.92" y="-2404.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="989.09" y="-2426" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the back&#45;end worker —</text>
<text xml:space="preserve" text-anchor="start" x="989.09" y="-2408" font-family="Arial" font-size="15.00" fill="#ffffff">business logic, endpoints, hooks,</text>
<text xml:space="preserve" text-anchor="start" x="989.09" y="-2390" font-family="Arial" font-size="15.00" fill="#ffffff">types, error factories. Spawned s b</text>
<text xml:space="preserve" text-anchor="start" x="989.09" y="-2372" font-family="Arial" font-size="15.00" fill="#ffffff">w, certified by respawn. Never</text>
<text xml:space="preserve" text-anchor="start" x="989.09" y="-2354" font-family="Arial" font-size="15.00" fill="#ffffff">writes tests, JSX, or CSS.</text>
</g>
<!-- labelambiguous -->
<g id="node4" class="node">
<title>labelambiguous</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="1285.72,-2210 864.22,-2210 864.22,-2030 1285.72,-2030 1285.72,-2210"/>
<text xml:space="preserve" text-anchor="start" x="912.34" y="-2114.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="956.29" y="-2159" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=label&#45;ambiguous</text>
<text xml:space="preserve" text-anchor="start" x="1263.72" y="-2114.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="956.29" y="-2136" font-family="Arial" font-size="15.00" fill="#fffade">What it is: zero or two dispatching</text>
<text xml:space="preserve" text-anchor="start" x="956.29" y="-2118" font-family="Arial" font-size="15.00" fill="#fffade">labels on a claim. The dispatcher</text>
<text xml:space="preserve" text-anchor="start" x="956.29" y="-2100" font-family="Arial" font-size="15.00" fill="#fffade">never guesses a specialist — the</text>
<text xml:space="preserve" text-anchor="start" x="956.29" y="-2082" font-family="Arial" font-size="15.00" fill="#fffade">ticket is LEFT CLAIMED so its lease</text>
<text xml:space="preserve" text-anchor="start" x="956.29" y="-2064" font-family="Arial" font-size="15.00" fill="#fffade">parks it off the frontier, and the</text>
</g>
<!-- metadatamissing -->
<g id="node5" class="node">
<title>metadatamissing</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="1291.27,-1920 858.68,-1920 858.68,-1740 1291.27,-1740 1291.27,-1920"/>
<text xml:space="preserve" text-anchor="start" x="906.8" y="-1824.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="950.75" y="-1869" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=metadata&#45;missing</text>
<text xml:space="preserve" text-anchor="start" x="1269.26" y="-1824.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="950.75" y="-1846" font-family="Arial" font-size="15.00" fill="#fffade">What it is: no branch in the</text>
<text xml:space="preserve" text-anchor="start" x="950.75" y="-1828" font-family="Arial" font-size="15.00" fill="#fffade">claim&#39;s metadata — a plan agent</text>
<text xml:space="preserve" text-anchor="start" x="950.75" y="-1810" font-family="Arial" font-size="15.00" fill="#fffade">skipped its one key. Left claimed,</text>
<text xml:space="preserve" text-anchor="start" x="950.75" y="-1792" font-family="Arial" font-size="15.00" fill="#fffade">same treatment as a mislabelled</text>
<text xml:space="preserve" text-anchor="start" x="950.75" y="-1774" font-family="Arial" font-size="15.00" fill="#fffade">ticket. The loop never invents a</text>
</g>
<!-- epic -->
<g id="node6" class="node">
<title>epic</title>
<polygon fill="#d97706" stroke="#ac5300" stroke-width="0" points="1277.08,-1630 872.87,-1630 872.87,-1450 1277.08,-1450 1277.08,-1630"/>
<text xml:space="preserve" text-anchor="start" x="920.99" y="-1534.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="964.93" y="-1579" font-family="Arial" font-size="20.00" fill="#ffffff">Epic — Recipe Box (RECIPE&#45;1)</text>
<text xml:space="preserve" text-anchor="start" x="1255.07" y="-1534.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="964.93" y="-1556" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the epic gate — the</text>
<text xml:space="preserve" text-anchor="start" x="964.93" y="-1538" font-family="Arial" font-size="15.00" fill="#ffffff">&quot;what&quot;; the human closes it once,</text>
<text xml:space="preserve" text-anchor="start" x="964.93" y="-1520" font-family="Arial" font-size="15.00" fill="#ffffff">after epic&#45;review is done.Branch:</text>
<text xml:space="preserve" text-anchor="start" x="964.93" y="-1502" font-family="Arial" font-size="15.00" fill="#ffffff">epic/recipe&#45;box → PR → main (the</text>
<text xml:space="preserve" text-anchor="start" x="964.93" y="-1484" font-family="Arial" font-size="15.00" fill="#ffffff">loop publishes it and writes pr as</text>
</g>
<!-- branchbusy -->
<g id="node7" class="node">
<title>branchbusy</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="1304.35,-1340 845.6,-1340 845.6,-1160 1304.35,-1160 1304.35,-1340"/>
<text xml:space="preserve" text-anchor="start" x="893.71" y="-1244.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="937.66" y="-1289" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=branch_busy held=N</text>
<text xml:space="preserve" text-anchor="start" x="1282.34" y="-1244.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="937.66" y="-1266" font-family="Arial" font-size="15.00" fill="#fffade">What it is: tickets exist and are</text>
<text xml:space="preserve" text-anchor="start" x="937.66" y="-1248" font-family="Arial" font-size="15.00" fill="#fffade">claimable, but every branch they</text>
<text xml:space="preserve" text-anchor="start" x="937.66" y="-1230" font-family="Arial" font-size="15.00" fill="#fffade">want is already working. The</text>
<text xml:space="preserve" text-anchor="start" x="937.66" y="-1212" font-family="Arial" font-size="15.00" fill="#fffade">freshly claimed ticket goes</text>
<text xml:space="preserve" text-anchor="start" x="937.66" y="-1194" font-family="Arial" font-size="15.00" fill="#fffade">straight back (bd unclaim) and the</text>
</g>
<!-- origin -->
<g id="node8" class="node">
<title>origin</title>
<path fill="#6b7280" stroke="#484f5c" stroke-width="2" d="M1252.09,-1033.64C1252.09,-1042.67 1172.71,-1050 1074.97,-1050 977.24,-1050 897.85,-1042.67 897.85,-1033.64 897.85,-1033.64 897.85,-886.36 897.85,-886.36 897.85,-877.33 977.24,-870 1074.97,-870 1172.71,-870 1252.09,-877.33 1252.09,-886.36 1252.09,-886.36 1252.09,-1033.64 1252.09,-1033.64"/>
<path fill="none" stroke="#484f5c" stroke-width="2" d="M1252.09,-1033.64C1252.09,-1024.61 1172.71,-1017.27 1074.97,-1017.27 977.24,-1017.27 897.85,-1024.61 897.85,-1033.64"/>
<text xml:space="preserve" text-anchor="start" x="945.97" y="-954.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="989.92" y="-999" font-family="Arial" font-size="20.00" fill="#ffffff">origin — GitHub</text>
<text xml:space="preserve" text-anchor="start" x="1230.09" y="-954.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="989.92" y="-976" font-family="Arial" font-size="15.00" fill="#fdffff">What it is: the remote the tower</text>
<text xml:space="preserve" text-anchor="start" x="989.92" y="-958" font-family="Arial" font-size="15.00" fill="#fdffff">publishes to. main at the bottom,</text>
<text xml:space="preserve" text-anchor="start" x="989.92" y="-940" font-family="Arial" font-size="15.00" fill="#fdffff">one PR per branch above it:</text>
<text xml:space="preserve" text-anchor="start" x="989.92" y="-922" font-family="Arial" font-size="15.00" fill="#fdffff">feature/&lt;slug&gt; → PR → the epic</text>
<text xml:space="preserve" text-anchor="start" x="989.92" y="-904" font-family="Arial" font-size="15.00" fill="#fdffff">branch, epic/&lt;slug&gt; → PR → main.</text>
</g>
<!-- epicprfailed -->
<g id="node9" class="node">
<title>epicprfailed</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="1306,-760 843.95,-760 843.95,-580 1306,-580 1306,-760"/>
<text xml:space="preserve" text-anchor="start" x="892.06" y="-664.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="936.01" y="-709" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=epic&#45;pr&#45;failed step=…</text>
<text xml:space="preserve" text-anchor="start" x="1283.99" y="-664.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="936.01" y="-686" font-family="Arial" font-size="15.00" fill="#fffade">What it is: the epic branch or its</text>
<text xml:space="preserve" text-anchor="start" x="936.01" y="-668" font-family="Arial" font-size="15.00" fill="#fffade">PR could not be published. Steps:</text>
<text xml:space="preserve" text-anchor="start" x="936.01" y="-650" font-family="Arial" font-size="15.00" fill="#fffade">walk, gate&#45;branch, forge,</text>
<text xml:space="preserve" text-anchor="start" x="936.01" y="-632" font-family="Arial" font-size="15.00" fill="#fffade">missing&#45;tool, push, pr, annotate.</text>
<text xml:space="preserve" text-anchor="start" x="936.01" y="-614" font-family="Arial" font-size="15.00" fill="#fffade">Left claimed — a worker spawned</text>
</g>
<!-- worktreefailed -->
<g id="node10" class="node">
<title>worktreefailed</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="1277.93,-470 872.02,-470 872.02,-290 1277.93,-290 1277.93,-470"/>
<text xml:space="preserve" text-anchor="start" x="920.14" y="-374.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="964.09" y="-419" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=worktree&#45;failed</text>
<text xml:space="preserve" text-anchor="start" x="1255.92" y="-374.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="964.09" y="-396" font-family="Arial" font-size="15.00" fill="#fffade">What it is: git worktree add failed</text>
<text xml:space="preserve" text-anchor="start" x="964.09" y="-378" font-family="Arial" font-size="15.00" fill="#fffade">under .claude/worktrees/. Left</text>
<text xml:space="preserve" text-anchor="start" x="964.09" y="-360" font-family="Arial" font-size="15.00" fill="#fffade">claimed — a worker spawned in a</text>
<text xml:space="preserve" text-anchor="start" x="964.09" y="-342" font-family="Arial" font-size="15.00" fill="#fffade">missing folder burns a slot on</text>
<text xml:space="preserve" text-anchor="start" x="964.09" y="-324" font-family="Arial" font-size="15.00" fill="#fffade">nothing.</text>
</g>
<!-- workernotdispatched -->
<g id="node11" class="node">
<title>workernotdispatched</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="1311.28,-180 838.67,-180 838.67,0 1311.28,0 1311.28,-180"/>
<text xml:space="preserve" text-anchor="start" x="886.79" y="-84.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="930.73" y="-120" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=worker&#45;not&#45;dispatched</text>
<text xml:space="preserve" text-anchor="start" x="1289.27" y="-84.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="930.73" y="-97" font-family="Arial" font-size="15.00" fill="#fffade">What it is: claude &#45;&#45;bg spawned no</text>
<text xml:space="preserve" text-anchor="start" x="930.73" y="-79" font-family="Arial" font-size="15.00" fill="#fffade">session. The ticket is put back</text>
<text xml:space="preserve" text-anchor="start" x="930.73" y="-61" font-family="Arial" font-size="15.00" fill="#fffade">with bd unclaim so the next tick</text>
<text xml:space="preserve" text-anchor="start" x="930.73" y="-43" font-family="Arial" font-size="15.00" fill="#fffade">can retry it.</text>
</g>
<!-- dispatcher&#45;&gt;beads -->
<g id="edge1" class="edge">
<title>dispatcher&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M201.08,-2431.85C207.53,-2723.34 244.67,-3634.25 457.46,-3813 566.77,-3904.82 658.24,-3889.66 778.67,-3813 963.37,-3695.43 1034.47,-3428.73 1060.31,-3282.16"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1062.89,-3282.64 1061.58,-3274.8 1057.72,-3281.75 1062.89,-3282.64"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="500.8,-3879.31 500.8,-3918.91 524.8,-3918.91 524.8,-3879.31 500.8,-3879.31"/>
<text xml:space="preserve" text-anchor="start" x="508.9" y="-3895.91" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">0</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="527.8,-3879.31 527.8,-3918.91 735.33,-3918.91 735.33,-3879.31 527.8,-3879.31"/>
<text xml:space="preserve" text-anchor="start" x="530.8" y="-3901.91" font-family="Arial" font-size="14.00" fill="#c9c9c9">probe the frontier: bd list &#45;&#45;status</text>
<text xml:space="preserve" text-anchor="start" x="565.03" y="-3885.11" font-family="Arial" font-size="14.00" fill="#c9c9c9">open,blocked &#45;&#45;limit 0</text>
</g>
<!-- dispatcher&#45;&gt;beads -->
<g id="edge2" class="edge">
<title>dispatcher&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M203.41,-2431.78C216.44,-2699.35 270.19,-3482.35 457.46,-3636 567.83,-3726.55 653.22,-3704.14 778.67,-3636 916.43,-3561.18 999.9,-3391.26 1041.43,-3281.56"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1043.86,-3282.58 1044.02,-3274.63 1038.94,-3280.74 1043.86,-3282.58"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="487.18,-3698.79 487.18,-3755.19 511.18,-3755.19 511.18,-3698.79 487.18,-3698.79"/>
<text xml:space="preserve" text-anchor="start" x="495.29" y="-3723.79" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="514.18,-3698.79 514.18,-3755.19 748.94,-3755.19 748.94,-3698.79 514.18,-3698.79"/>
<text xml:space="preserve" text-anchor="start" x="517.18" y="-3738.19" font-family="Arial" font-size="14.00" fill="#c9c9c9">bd ready &#45;&#45;claim (atomic — a bare bd</text>
<text xml:space="preserve" text-anchor="start" x="524.56" y="-3721.39" font-family="Arial" font-size="14.00" fill="#c9c9c9">ready would let two loops steal the</text>
<text xml:space="preserve" text-anchor="start" x="612.89" y="-3704.59" font-family="Arial" font-size="14.00" fill="#c9c9c9">ticket)</text>
</g>
<!-- dispatcher&#45;&gt;beads -->
<g id="edge5" class="edge">
<title>dispatcher&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M206.15,-2431.87C225.66,-2676.37 293.29,-3343.98 457.46,-3475 569.04,-3564.05 646.71,-3529.48 778.67,-3475 873.93,-3435.67 954.61,-3349.07 1007.45,-3279.99"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1009.49,-3281.63 1011.93,-3274.07 1005.31,-3278.46 1009.49,-3281.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="483.68,-3532.58 483.68,-3572.18 507.68,-3572.18 507.68,-3532.58 483.68,-3532.58"/>
<text xml:space="preserve" text-anchor="start" x="491.79" y="-3549.18" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="510.68,-3532.58 510.68,-3572.18 752.45,-3572.18 752.45,-3532.58 510.68,-3532.58"/>
<text xml:space="preserve" text-anchor="start" x="513.68" y="-3555.18" font-family="Arial" font-size="14.00" fill="#c9c9c9">leave it CLAIMED — the lease parks it</text>
<text xml:space="preserve" text-anchor="start" x="588.37" y="-3538.38" font-family="Arial" font-size="14.00" fill="#c9c9c9">off the frontier</text>
</g>
<!-- dispatcher&#45;&gt;beads -->
<g id="edge6" class="edge">
<title>dispatcher&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M210.18,-2431.91C237.45,-2648.94 318.45,-3191.5 457.46,-3298 589.66,-3399.28 783.8,-3337.89 918.77,-3271.99"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="919.71,-3274.45 925.27,-3268.78 917.38,-3269.75 919.71,-3274.45"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="469.47,-3354.61 469.47,-3411.01 493.47,-3411.01 493.47,-3354.61 469.47,-3354.61"/>
<text xml:space="preserve" text-anchor="start" x="477.58" y="-3379.61" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="496.47,-3354.61 496.47,-3411.01 766.65,-3411.01 766.65,-3354.61 496.47,-3354.61"/>
<text xml:space="preserve" text-anchor="start" x="499.47" y="-3394.01" font-family="Arial" font-size="14.00" fill="#c9c9c9">BO_BRANCH = feature/add&#45;recipe — read</text>
<text xml:space="preserve" text-anchor="start" x="526.52" y="-3377.21" font-family="Arial" font-size="14.00" fill="#c9c9c9">off the claim, nothing re&#45;derives it,</text>
<text xml:space="preserve" text-anchor="start" x="572.42" y="-3360.41" font-family="Arial" font-size="14.00" fill="#c9c9c9">nothing parses text</text>
</g>
<!-- dispatcher&#45;&gt;beads -->
<g id="edge8" class="edge">
<title>dispatcher&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M215.54,-2431.74C250.99,-2621.84 342.78,-3055.02 457.46,-3144 576.87,-3236.65 751.69,-3238.49 884.7,-3221.44"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="884.92,-3224.06 892,-3220.46 884.22,-3218.85 884.92,-3224.06"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="516.76,-3232.72 516.76,-3265.52 540.76,-3265.52 540.76,-3232.72 516.76,-3232.72"/>
<text xml:space="preserve" text-anchor="start" x="524.87" y="-3245.92" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">7</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="543.76,-3232.72 543.76,-3265.52 719.36,-3265.52 719.36,-3232.72 543.76,-3232.72"/>
<text xml:space="preserve" text-anchor="start" x="546.76" y="-3243.52" font-family="Arial" font-size="14.00" fill="#c9c9c9">branchesCurrentlyAtWork()</text>
</g>
<!-- dispatcher&#45;&gt;beads -->
<g id="edge9" class="edge">
<title>dispatcher&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M210.08,-2431.97C231.03,-2572.03 291.59,-2841.52 457.46,-2990 567.77,-3088.74 637.3,-3034.24 778.67,-3078.2 813.26,-3088.96 849.88,-3101.09 885.12,-3113.15"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="884.21,-3115.61 892.16,-3115.57 885.92,-3110.65 884.21,-3115.61"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="533.48,-3081.2 533.48,-3114 557.48,-3114 557.48,-3081.2 533.48,-3081.2"/>
<text xml:space="preserve" text-anchor="start" x="541.59" y="-3094.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">8</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="560.48,-3081.2 560.48,-3114 702.65,-3114 702.65,-3081.2 560.48,-3081.2"/>
<text xml:space="preserve" text-anchor="start" x="563.48" y="-3092" font-family="Arial" font-size="14.00" fill="#c9c9c9">bd unclaim RECIPE&#45;6</text>
</g>
<!-- dispatcher&#45;&gt;beads -->
<g id="edge13" class="edge">
<title>dispatcher&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M225.03,-2431.57C259.81,-2538.3 332.71,-2714.54 457.46,-2813 573.61,-2904.68 649.73,-2827.99 778.67,-2900.6 861.22,-2947.09 938.28,-3021.75 992.96,-3082.35"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="990.87,-3083.95 997.83,-3087.79 994.78,-3080.45 990.87,-3083.95"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="470.36,-2903.6 470.36,-2960 501.93,-2960 501.93,-2903.6 470.36,-2903.6"/>
<text xml:space="preserve" text-anchor="start" x="478.36" y="-2928.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">12</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="504.93,-2903.6 504.93,-2960 765.77,-2960 765.77,-2903.6 504.93,-2903.6"/>
<text xml:space="preserve" text-anchor="start" x="522.52" y="-2943" font-family="Arial" font-size="14.00" fill="#c9c9c9">bd update RECIPE&#45;1 &#45;&#45;set&#45;metadata</text>
<text xml:space="preserve" text-anchor="start" x="507.93" y="-2926.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">pr=https://github.com/…/pull/1 (merges —</text>
<text xml:space="preserve" text-anchor="start" x="565.71" y="-2909.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">never disturbs branch)</text>
</g>
<!-- dispatcher&#45;&gt;beads -->
<g id="edge15" class="edge">
<title>dispatcher&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M256.97,-2431.83C303.39,-2497.64 374.58,-2584.19 457.46,-2636 582.94,-2714.43 659.27,-2636.2 778.67,-2723.6 903.29,-2814.83 989.14,-2975.94 1034.93,-3080.56"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1032.51,-3081.58 1037.9,-3087.41 1037.33,-3079.49 1032.51,-3081.58"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="482.02,-2726.6 482.02,-2783 513.59,-2783 513.59,-2726.6 482.02,-2726.6"/>
<text xml:space="preserve" text-anchor="start" x="490.02" y="-2751.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">14</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="516.59,-2726.6 516.59,-2783 754.11,-2783 754.11,-2726.6 516.59,-2726.6"/>
<text xml:space="preserve" text-anchor="start" x="526.03" y="-2766" font-family="Arial" font-size="14.00" fill="#c9c9c9">ensureWorktree — git worktree add</text>
<text xml:space="preserve" text-anchor="start" x="519.59" y="-2749.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">.claude/worktrees/feature+add&#45;recipe</text>
<text xml:space="preserve" text-anchor="start" x="559.47" y="-2732.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">origin/feature/add&#45;recipe</text>
</g>
<!-- dispatcher&#45;&gt;beads -->
<g id="edge18" class="edge">
<title>dispatcher&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M351.62,-2431.96C385.74,-2450.05 422.27,-2467.83 457.46,-2482 594.79,-2537.3 664.89,-2475.48 778.67,-2570.2 938.74,-2703.45 1018.57,-2944.03 1052.64,-3080.1"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1050.04,-3080.53 1054.39,-3087.18 1055.14,-3079.27 1050.04,-3080.53"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="529.7,-2573.2 529.7,-2606 561.27,-2606 561.27,-2573.2 529.7,-2573.2"/>
<text xml:space="preserve" text-anchor="start" x="537.7" y="-2586.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">17</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="564.27,-2573.2 564.27,-2606 706.43,-2606 706.43,-2573.2 564.27,-2573.2"/>
<text xml:space="preserve" text-anchor="start" x="567.27" y="-2584" font-family="Arial" font-size="14.00" fill="#c9c9c9">bd unclaim RECIPE&#45;6</text>
</g>
<!-- dispatcher&#45;&gt;beads -->
<g id="edge20" class="edge">
<title>dispatcher&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M397.35,-2309.5C519.05,-2300.64 671.71,-2310.94 778.67,-2392.6 839.83,-2439.29 811.8,-2482.9 838.67,-2555 907.8,-2740.5 989.23,-2956.6 1035.9,-3080.25"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1033.44,-3081.17 1038.55,-3087.26 1038.36,-3079.31 1033.44,-3081.17"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="474.42,-2395.6 474.42,-2452 505.99,-2452 505.99,-2395.6 474.42,-2395.6"/>
<text xml:space="preserve" text-anchor="start" x="482.42" y="-2420.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">19</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="508.99,-2395.6 508.99,-2452 761.71,-2452 761.71,-2395.6 508.99,-2395.6"/>
<text xml:space="preserve" text-anchor="start" x="517.83" y="-2435" font-family="Arial" font-size="14.00" fill="#c9c9c9">log one line, move on — the loop polls</text>
<text xml:space="preserve" text-anchor="start" x="511.99" y="-2418.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">nothing, reaps nothing, merges nothing,</text>
<text xml:space="preserve" text-anchor="start" x="595.26" y="-2401.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">ends nothing</text>
</g>
<!-- dispatcher&#45;&gt;engineer -->
<g id="edge3" class="edge">
<title>dispatcher&#45;&gt;engineer</title>
<path fill="none" stroke="#1c4ab0" stroke-width="2" stroke-dasharray="5,2" d="M397.44,-2257.99C417.44,-2251.98 437.67,-2246.86 457.46,-2243.2 597.83,-2217.22 640.6,-2206.9 778.67,-2243.2 809.28,-2251.25 866.25,-2281.95 922.05,-2314.86"/>
<polygon fill="#1c4ab0" stroke="#1c4ab0" stroke-width="2" points="920.6,-2317.05 928.39,-2318.61 923.27,-2312.53 920.6,-2317.05"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="495.15,-2246.2 495.15,-2279 519.15,-2279 519.15,-2246.2 495.15,-2246.2"/>
<text xml:space="preserve" text-anchor="start" x="503.25" y="-2259.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#f1ffff">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="522.15,-2246.2 522.15,-2279 740.98,-2279 740.98,-2246.2 522.15,-2246.2"/>
<text xml:space="preserve" text-anchor="start" x="525.15" y="-2257" font-family="Arial" font-size="14.00" fill="#f1ffff">AGENT[backend&#45;logic] = engineer</text>
</g>
<!-- dispatcher&#45;&gt;engineer -->
<g id="edge17" class="edge">
<title>dispatcher&#45;&gt;engineer</title>
<path fill="none" stroke="#1c4ab0" stroke-width="2" stroke-dasharray="5,2" d="M279.06,-2252.27C325.8,-2206.34 389.07,-2155.06 457.46,-2130.6 591.88,-2082.52 658.9,-2052.91 778.67,-2130.6 833.55,-2166.2 795.57,-2215.79 838.67,-2265 854.23,-2282.77 872.5,-2299.06 891.87,-2313.8"/>
<polygon fill="#1c4ab0" stroke="#1c4ab0" stroke-width="2" points="890.22,-2315.84 897.81,-2318.21 893.35,-2311.63 890.22,-2315.84"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="460.46,-2133.6 460.46,-2190 492.03,-2190 492.03,-2133.6 460.46,-2133.6"/>
<text xml:space="preserve" text-anchor="start" x="468.46" y="-2158.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#f1ffff">16</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="495.03,-2133.6 495.03,-2190 775.67,-2190 775.67,-2133.6 495.03,-2133.6"/>
<text xml:space="preserve" text-anchor="start" x="547.02" y="-2173" font-family="Arial" font-size="14.00" fill="#f1ffff">claude &#45;&#45;bg &#45;&#45;agent engineer</text>
<text xml:space="preserve" text-anchor="start" x="498.03" y="-2156.2" font-family="Arial" font-size="14.00" fill="#f1ffff">&#45;&#45;permission&#45;mode bypassPermissions (cwd</text>
<text xml:space="preserve" text-anchor="start" x="569.22" y="-2139.4" font-family="Arial" font-size="14.00" fill="#f1ffff">INSIDE the worktree)</text>
</g>
<!-- dispatcher&#45;&gt;labelambiguous -->
<g id="edge4" class="edge">
<title>dispatcher&#45;&gt;labelambiguous</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M241.92,-2252.13C284.18,-2173.86 357.32,-2065.58 457.46,-2017.2 586.02,-1955.1 745.28,-1983.99 869.73,-2026.74"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="868.58,-2029.12 876.53,-2029.11 870.31,-2024.16 868.58,-2029.12"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="519.46,-2020.2 519.46,-2053 543.46,-2053 543.46,-2020.2 519.46,-2020.2"/>
<text xml:space="preserve" text-anchor="start" x="527.57" y="-2033.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#fffff3">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="546.46,-2020.2 546.46,-2053 716.66,-2053 716.66,-2020.2 546.46,-2020.2"/>
<text xml:space="preserve" text-anchor="start" x="549.46" y="-2031" font-family="Arial" font-size="14.00" fill="#fffff3">never guesses a specialist</text>
</g>
<!-- dispatcher&#45;&gt;metadatamissing -->
<g id="edge7" class="edge">
<title>dispatcher&#45;&gt;metadatamissing</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M226.55,-2252.12C261.89,-2150.61 334.44,-1989.09 457.46,-1908.4 571.76,-1833.43 723.92,-1813.46 848.47,-1812.42"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="848.39,-1815.04 855.88,-1812.39 848.37,-1809.79 848.39,-1815.04"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="474.54,-1911.4 474.54,-1951 498.54,-1951 498.54,-1911.4 474.54,-1911.4"/>
<text xml:space="preserve" text-anchor="start" x="482.65" y="-1928" font-family="Arial" font-weight="bold" font-size="14.00" fill="#fffff3">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="501.54,-1911.4 501.54,-1951 761.59,-1951 761.59,-1911.4 501.54,-1911.4"/>
<text xml:space="preserve" text-anchor="start" x="504.54" y="-1934" font-family="Arial" font-size="14.00" fill="#fffff3">ERROR reason=metadata&#45;missing — left</text>
<text xml:space="preserve" text-anchor="start" x="607.44" y="-1917.2" font-family="Arial" font-size="14.00" fill="#fffff3">claimed</text>
</g>
<!-- dispatcher&#45;&gt;epic -->
<g id="edge11" class="edge">
<title>dispatcher&#45;&gt;epic</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M212.68,-2252.14C236.72,-2118.17 300.87,-1866.75 457.46,-1725.6 568.62,-1625.4 732.14,-1579.24 862.85,-1558"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="863.01,-1560.64 870,-1556.87 862.19,-1555.45 863.01,-1560.64"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="465.9,-1728.6 465.9,-1785 497.47,-1785 497.47,-1728.6 465.9,-1728.6"/>
<text xml:space="preserve" text-anchor="start" x="473.9" y="-1753.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">10</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="500.47,-1728.6 500.47,-1785 770.23,-1785 770.23,-1728.6 500.47,-1728.6"/>
<text xml:space="preserve" text-anchor="start" x="503.47" y="-1768" font-family="Arial" font-size="14.00" fill="#c9c9c9">walk RECIPE&#45;5 to RECIPE&#45;1 (epicGateOf,</text>
<text xml:space="preserve" text-anchor="start" x="506.17" y="-1751.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">two hops at most) — read the PR base off</text>
<text xml:space="preserve" text-anchor="start" x="610.05" y="-1734.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">the gate</text>
</g>
<!-- dispatcher&#45;&gt;branchbusy -->
<g id="edge10" class="edge">
<title>dispatcher&#45;&gt;branchbusy</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M201.98,-2252.19C211.04,-2081.48 254.42,-1707.68 457.46,-1488.6 556.11,-1382.15 707.74,-1322.65 835.92,-1289.69"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="836.33,-1292.29 842.96,-1287.91 835.05,-1287.2 836.33,-1292.29"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="487.38,-1491.6 487.38,-1548 511.38,-1548 511.38,-1491.6 487.38,-1491.6"/>
<text xml:space="preserve" text-anchor="start" x="495.48" y="-1516.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#fffff3">9</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="514.38,-1491.6 514.38,-1548 748.75,-1548 748.75,-1491.6 514.38,-1491.6"/>
<text xml:space="preserve" text-anchor="start" x="518.72" y="-1531" font-family="Arial" font-size="14.00" fill="#fffff3">one pair of hands per branch; try the</text>
<text xml:space="preserve" text-anchor="start" x="517.38" y="-1514.2" font-family="Arial" font-size="14.00" fill="#fffff3">next claim, max max_parallel + 2 per</text>
<text xml:space="preserve" text-anchor="start" x="621.06" y="-1497.4" font-family="Arial" font-size="14.00" fill="#fffff3">tick</text>
</g>
<!-- dispatcher&#45;&gt;origin -->
<g id="edge12" class="edge">
<title>dispatcher&#45;&gt;origin</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M209.64,-2252.38C237.54,-2014.66 323.53,-1375.36 457.46,-1216.6 565.69,-1088.31 748.68,-1023.06 887.26,-990.57"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="887.49,-993.21 894.21,-988.97 886.31,-988.1 887.49,-993.21"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="472.48,-1219.6 472.48,-1276 504.05,-1276 504.05,-1219.6 472.48,-1219.6"/>
<text xml:space="preserve" text-anchor="start" x="480.48" y="-1244.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">11</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="507.05,-1219.6 507.05,-1276 763.65,-1276 763.65,-1219.6 507.05,-1219.6"/>
<text xml:space="preserve" text-anchor="start" x="510.05" y="-1259" font-family="Arial" font-size="14.00" fill="#c9c9c9">ensureEpicGatePr — the gate has no pr:</text>
<text xml:space="preserve" text-anchor="start" x="512.77" y="-1242.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">push epic/recipe&#45;box off main, open the</text>
<text xml:space="preserve" text-anchor="start" x="625.63" y="-1225.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">PR</text>
</g>
<!-- dispatcher&#45;&gt;epicprfailed -->
<g id="edge14" class="edge">
<title>dispatcher&#45;&gt;epicprfailed</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M204.77,-2252.44C222.16,-1973.13 288.15,-1124.27 457.46,-916.8 550.35,-802.98 703.52,-741.32 833.95,-708.09"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="834.52,-710.66 841.16,-706.29 833.24,-705.56 834.52,-710.66"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="483.76,-919.8 483.76,-993 515.34,-993 515.34,-919.8 483.76,-919.8"/>
<text xml:space="preserve" text-anchor="start" x="491.76" y="-953.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#fffff3">13</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="518.34,-919.8 518.34,-993 752.36,-993 752.36,-919.8 518.34,-919.8"/>
<text xml:space="preserve" text-anchor="start" x="537.7" y="-976" font-family="Arial" font-size="14.00" fill="#fffff3">left claimed — a worker under a</text>
<text xml:space="preserve" text-anchor="start" x="521.34" y="-959.2" font-family="Arial" font-size="14.00" fill="#fffff3">nonexistent epic branch burns a slot;</text>
<text xml:space="preserve" text-anchor="start" x="537.69" y="-942.4" font-family="Arial" font-size="14.00" fill="#fffff3">steps: walk, gate&#45;branch, forge,</text>
<text xml:space="preserve" text-anchor="start" x="537.68" y="-925.6" font-family="Arial" font-size="14.00" fill="#fffff3">missing&#45;tool, push, pr, annotate</text>
</g>
<!-- dispatcher&#45;&gt;worktreefailed -->
<g id="edge16" class="edge">
<title>dispatcher&#45;&gt;worktreefailed</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M202.32,-2252.02C212.98,-1939.83 262.56,-908.49 457.46,-653.4 555.08,-525.63 725.38,-456.27 862.29,-419.41"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="862.59,-422.05 869.16,-417.59 861.24,-416.98 862.59,-422.05"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="480.09,-656.4 480.09,-696 511.67,-696 511.67,-656.4 480.09,-656.4"/>
<text xml:space="preserve" text-anchor="start" x="488.09" y="-673" font-family="Arial" font-weight="bold" font-size="14.00" fill="#fffff3">15</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="514.67,-656.4 514.67,-696 756.03,-696 756.03,-656.4 514.67,-656.4"/>
<text xml:space="preserve" text-anchor="start" x="517.67" y="-679" font-family="Arial" font-size="14.00" fill="#fffff3">ERROR reason=worktree&#45;failed — left</text>
<text xml:space="preserve" text-anchor="start" x="611.23" y="-662.2" font-family="Arial" font-size="14.00" fill="#fffff3">claimed</text>
</g>
<!-- dispatcher&#45;&gt;workernotdispatched -->
<g id="edge19" class="edge">
<title>dispatcher&#45;&gt;workernotdispatched</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M200.44,-2252.11C204.77,-1909.11 235.79,-686.56 457.46,-382.2 545.9,-260.77 698.03,-187.94 829.03,-145.36"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="829.6,-147.93 835.94,-143.14 828,-142.93 829.6,-147.93"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="475.81,-385.2 475.81,-418 507.38,-418 507.38,-385.2 475.81,-385.2"/>
<text xml:space="preserve" text-anchor="start" x="483.81" y="-398.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#fffff3">18</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="510.38,-385.2 510.38,-418 760.32,-418 760.32,-385.2 510.38,-385.2"/>
<text xml:space="preserve" text-anchor="start" x="513.38" y="-396" font-family="Arial" font-size="14.00" fill="#fffff3">ERROR reason=worker&#45;not&#45;dispatched</text>
</g>
</g>
</svg>
`;case`workerToGate`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 16.1.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="3866pt" height="1339pt"
 viewBox="0.00 0.00 3866.00 1339.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1324.05)">
<!-- engineer -->
<g id="node1" class="node">
<title>engineer</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="355.9,-572 0,-572 0,-392 355.9,-392 355.9,-572"/>
<text xml:space="preserve" text-anchor="start" x="48.12" y="-476.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-521" font-family="Arial" font-size="20.00" fill="#ffffff">engineer</text>
<text xml:space="preserve" text-anchor="start" x="333.89" y="-476.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-498" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the back&#45;end worker —</text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-480" font-family="Arial" font-size="15.00" fill="#ffffff">business logic, endpoints, hooks,</text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-462" font-family="Arial" font-size="15.00" fill="#ffffff">types, error factories. Spawned s b</text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-444" font-family="Arial" font-size="15.00" fill="#ffffff">w, certified by respawn. Never</text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-426" font-family="Arial" font-size="15.00" fill="#ffffff">writes tests, JSX, or CSS.</text>
</g>
<!-- beads -->
<g id="node2" class="node">
<title>beads</title>
<path fill="#6b7280" stroke="#484f5c" stroke-width="2" d="M1208.49,-453.64C1208.49,-462.67 1128.17,-470 1029.29,-470 930.4,-470 850.08,-462.67 850.08,-453.64 850.08,-453.64 850.08,-306.36 850.08,-306.36 850.08,-297.33 930.4,-290 1029.29,-290 1128.17,-290 1208.49,-297.33 1208.49,-306.36 1208.49,-306.36 1208.49,-453.64 1208.49,-453.64"/>
<path fill="none" stroke="#484f5c" stroke-width="2" d="M1208.49,-453.64C1208.49,-444.61 1128.17,-437.27 1029.29,-437.27 930.4,-437.27 850.08,-444.61 850.08,-453.64"/>
<text xml:space="preserve" text-anchor="start" x="898.2" y="-374.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="942.14" y="-419" font-family="Arial" font-size="20.00" fill="#ffffff">beads DB (bd)</text>
<text xml:space="preserve" text-anchor="start" x="1186.48" y="-374.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="942.14" y="-396" font-family="Arial" font-size="15.00" fill="#fdffff">What it is: the beads issue</text>
<text xml:space="preserve" text-anchor="start" x="942.14" y="-378" font-family="Arial" font-size="15.00" fill="#fdffff">database — the loop&#39;s only runtime</text>
<text xml:space="preserve" text-anchor="start" x="942.14" y="-360" font-family="Arial" font-size="15.00" fill="#fdffff">input. None of the contract docs</text>
<text xml:space="preserve" text-anchor="start" x="942.14" y="-342" font-family="Arial" font-size="15.00" fill="#fdffff">are read at runtime; the graph</text>
<text xml:space="preserve" text-anchor="start" x="942.14" y="-324" font-family="Arial" font-size="15.00" fill="#fdffff">lives here.Verbs the tower uses: bd</text>
</g>
<!-- hook -->
<g id="node3" class="node">
<title>hook</title>
<polygon fill="#0e7490" stroke="#00516b" stroke-width="0" points="2212.06,-722 1706.75,-722 1706.75,-542 2212.06,-542 2212.06,-722"/>
<text xml:space="preserve" text-anchor="start" x="1774.82" y="-626.4" font-family="Arial" font-size="14.00" fill="#ceffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1818.76" y="-671" font-family="Arial" font-size="20.00" fill="#ceffff">hooks/worker&#45;stop.sh — the Stop hook</text>
<text xml:space="preserve" text-anchor="start" x="2170.1" y="-626.4" font-family="Arial" font-size="14.00" fill="#ceffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1818.76" y="-648" font-family="Arial" font-size="15.00" fill="#b9ffff">What it is: the fail&#45;closed</text>
<text xml:space="preserve" text-anchor="start" x="1818.76" y="-630" font-family="Arial" font-size="15.00" fill="#b9ffff">gatekeeper that fires when a worker</text>
<text xml:space="preserve" text-anchor="start" x="1818.76" y="-612" font-family="Arial" font-size="15.00" fill="#b9ffff">session stops.Steps:checks</text>
<text xml:space="preserve" text-anchor="start" x="1818.76" y="-594" font-family="Arial" font-size="15.00" fill="#b9ffff">$BO_DONE_FILE — no marker, no</text>
<text xml:space="preserve" text-anchor="start" x="1818.76" y="-576" font-family="Arial" font-size="15.00" fill="#b9ffff">commit, no push, no PR, no close</text>
</g>
<!-- notdeclareddone -->
<g id="node4" class="node">
<title>notdeclareddone</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="3074.25,-931 2637.17,-931 2637.17,-751 3074.25,-751 3074.25,-931"/>
<text xml:space="preserve" text-anchor="start" x="2685.29" y="-835.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="2729.24" y="-880" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=not&#45;declared&#45;done</text>
<text xml:space="preserve" text-anchor="start" x="3052.24" y="-835.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="2729.24" y="-857" font-family="Arial" font-size="15.00" fill="#fffade">What it is: the Stop hook fired but</text>
<text xml:space="preserve" text-anchor="start" x="2729.24" y="-839" font-family="Arial" font-size="15.00" fill="#fffade">$BO_DONE_FILE was never touched.</text>
<text xml:space="preserve" text-anchor="start" x="2729.24" y="-821" font-family="Arial" font-size="15.00" fill="#fffade">Fail&#45;closed: no commit, no push, no</text>
<text xml:space="preserve" text-anchor="start" x="2729.24" y="-803" font-family="Arial" font-size="15.00" fill="#fffade">PR, no close. The ticket stays</text>
<text xml:space="preserve" text-anchor="start" x="2729.24" y="-785" font-family="Arial" font-size="15.00" fill="#fffade">claimed so its lease parks it off</text>
</g>
<!-- reviewagent -->
<g id="node5" class="node">
<title>reviewagent</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="2139.46,-351 1779.35,-351 1779.35,-171 2139.46,-171 2139.46,-351"/>
<text xml:space="preserve" text-anchor="start" x="1827.47" y="-255.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1871.42" y="-300" font-family="Arial" font-size="20.00" fill="#ffffff">review</text>
<text xml:space="preserve" text-anchor="start" x="2117.45" y="-255.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1871.42" y="-277" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the reviewer — three</text>
<text xml:space="preserve" text-anchor="start" x="1871.42" y="-259" font-family="Arial" font-size="15.00" fill="#ffffff">questions from first principles:</text>
<text xml:space="preserve" text-anchor="start" x="1871.42" y="-241" font-family="Arial" font-size="15.00" fill="#ffffff">does the code do what its source of</text>
<text xml:space="preserve" text-anchor="start" x="1871.42" y="-223" font-family="Arial" font-size="15.00" fill="#ffffff">truth demands, do the tests prove</text>
<text xml:space="preserve" text-anchor="start" x="1871.42" y="-205" font-family="Arial" font-size="15.00" fill="#ffffff">it, is it simple and readable. Maps</text>
</g>
<!-- origin -->
<g id="node6" class="node">
<title>origin</title>
<path fill="#6b7280" stroke="#484f5c" stroke-width="2" d="M3032.83,-334.64C3032.83,-343.67 2953.44,-351 2855.71,-351 2757.98,-351 2678.59,-343.67 2678.59,-334.64 2678.59,-334.64 2678.59,-187.36 2678.59,-187.36 2678.59,-178.33 2757.98,-171 2855.71,-171 2953.44,-171 3032.83,-178.33 3032.83,-187.36 3032.83,-187.36 3032.83,-334.64 3032.83,-334.64"/>
<path fill="none" stroke="#484f5c" stroke-width="2" d="M3032.83,-334.64C3032.83,-325.61 2953.44,-318.27 2855.71,-318.27 2757.98,-318.27 2678.59,-325.61 2678.59,-334.64"/>
<text xml:space="preserve" text-anchor="start" x="2726.71" y="-255.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2770.66" y="-300" font-family="Arial" font-size="20.00" fill="#ffffff">origin — GitHub</text>
<text xml:space="preserve" text-anchor="start" x="3010.82" y="-255.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2770.66" y="-277" font-family="Arial" font-size="15.00" fill="#fdffff">What it is: the remote the tower</text>
<text xml:space="preserve" text-anchor="start" x="2770.66" y="-259" font-family="Arial" font-size="15.00" fill="#fdffff">publishes to. main at the bottom,</text>
<text xml:space="preserve" text-anchor="start" x="2770.66" y="-241" font-family="Arial" font-size="15.00" fill="#fdffff">one PR per branch above it:</text>
<text xml:space="preserve" text-anchor="start" x="2770.66" y="-223" font-family="Arial" font-size="15.00" fill="#fdffff">feature/&lt;slug&gt; → PR → the epic</text>
<text xml:space="preserve" text-anchor="start" x="2770.66" y="-205" font-family="Arial" font-size="15.00" fill="#fdffff">branch, epic/&lt;slug&gt; → PR → main.</text>
</g>
<!-- noprtarget -->
<g id="node7" class="node">
<title>noprtarget</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="3045.33,-641 2666.09,-641 2666.09,-461 3045.33,-461 3045.33,-641"/>
<text xml:space="preserve" text-anchor="start" x="2714.21" y="-545.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="2758.16" y="-581" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=no&#45;pr&#45;target</text>
<text xml:space="preserve" text-anchor="start" x="3023.32" y="-545.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="2758.16" y="-558" font-family="Arial" font-size="15.00" fill="#fffade">What it is: the Stop hook found no</text>
<text xml:space="preserve" text-anchor="start" x="2758.16" y="-540" font-family="Arial" font-size="15.00" fill="#fffade">PR target the loop never handed</text>
<text xml:space="preserve" text-anchor="start" x="2758.16" y="-522" font-family="Arial" font-size="15.00" fill="#fffade">down — named for the target, since</text>
<text xml:space="preserve" text-anchor="start" x="2758.16" y="-504" font-family="Arial" font-size="15.00" fill="#fffade">pr now means the url.</text>
</g>
<!-- dispatcher -->
<g id="node8" class="node">
<title>dispatcher</title>
<polygon fill="#2563eb" stroke="#0042c2" stroke-width="0" points="3054.44,-1221 2656.98,-1221 2656.98,-1041 3054.44,-1041 3054.44,-1221"/>
<text xml:space="preserve" text-anchor="start" x="2725.05" y="-1125.4" font-family="Arial" font-size="14.00" fill="#f1ffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2768.99" y="-1170" font-family="Arial" font-size="20.00" fill="#f1ffff">bo loop — the dispatcher</text>
<text xml:space="preserve" text-anchor="start" x="3012.49" y="-1125.4" font-family="Arial" font-size="14.00" fill="#f1ffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2768.99" y="-1147" font-family="Arial" font-size="15.00" fill="#ddf2ff">What it is: CLI/beads&#45;loop.sh — the</text>
<text xml:space="preserve" text-anchor="start" x="2768.99" y="-1129" font-family="Arial" font-size="15.00" fill="#ddf2ff">one command (bo loop) that turns</text>
<text xml:space="preserve" text-anchor="start" x="2768.99" y="-1111" font-family="Arial" font-size="15.00" fill="#ddf2ff">beads tickets into background</text>
<text xml:space="preserve" text-anchor="start" x="2768.99" y="-1093" font-family="Arial" font-size="15.00" fill="#ddf2ff">workers.Steps it runs, one per</text>
<text xml:space="preserve" text-anchor="start" x="2768.99" y="-1075" font-family="Arial" font-size="15.00" fill="#ddf2ff">tick:reads the branches already at</text>
</g>
<!-- testerunit -->
<g id="node9" class="node">
<title>testerunit</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="3835.84,-180 3476.62,-180 3476.62,0 3835.84,0 3835.84,-180"/>
<text xml:space="preserve" text-anchor="start" x="3524.73" y="-84.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="3568.68" y="-138.8" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;unit</text>
<text xml:space="preserve" text-anchor="start" x="3813.83" y="-84.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="3568.68" y="-117.8" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="3568.68" y="-96.2" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the micro tier — one</text>
<text xml:space="preserve" text-anchor="start" x="3568.68" y="-78.2" font-family="Arial" font-size="15.00" fill="#ffffff">back&#45;end function alone; every</text>
<text xml:space="preserve" text-anchor="start" x="3568.68" y="-60.2" font-family="Arial" font-size="15.00" fill="#ffffff">branch, boundary, empty/null,</text>
<text xml:space="preserve" text-anchor="start" x="3568.68" y="-42.2" font-family="Arial" font-size="15.00" fill="#ffffff">error. Never a component (the UI is</text>
<text xml:space="preserve" text-anchor="start" x="3568.68" y="-24.2" font-family="Arial" font-size="15.00" fill="#ffffff">proved by the composition tier).</text>
</g>
<!-- human -->
<g id="node10" class="node">
<title>human</title>
<polygon fill="#6b7280" stroke="#484f5c" stroke-width="0" points="355.07,-1164 0.83,-1164 0.83,-984 355.07,-984 355.07,-1164"/>
<text xml:space="preserve" text-anchor="start" x="48.95" y="-1068.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="92.9" y="-1113" font-family="Arial" font-size="20.00" fill="#ffffff">Human (Brodie)</text>
<text xml:space="preserve" text-anchor="start" x="333.06" y="-1068.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="92.9" y="-1090" font-family="Arial" font-size="15.00" fill="#fdffff">What it is: the only one who closes</text>
<text xml:space="preserve" text-anchor="start" x="92.9" y="-1072" font-family="Arial" font-size="15.00" fill="#fdffff">gates. Workers leave their tickets</text>
<text xml:space="preserve" text-anchor="start" x="92.9" y="-1054" font-family="Arial" font-size="15.00" fill="#fdffff">open and report in their final</text>
<text xml:space="preserve" text-anchor="start" x="92.9" y="-1036" font-family="Arial" font-size="15.00" fill="#fdffff">message; the human reads the</text>
<text xml:space="preserve" text-anchor="start" x="92.9" y="-1018" font-family="Arial" font-size="15.00" fill="#fdffff">report, verifies the branch, and</text>
</g>
<!-- feata -->
<g id="node11" class="node">
<title>feata</title>
<polygon fill="#d97706" stroke="#ac5300" stroke-width="0" points="1255.31,-1309 803.27,-1309 803.27,-1129 1255.31,-1129 1255.31,-1309"/>
<text xml:space="preserve" text-anchor="start" x="851.39" y="-1213.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="895.33" y="-1258" font-family="Arial" font-size="20.00" fill="#ffffff">Feature — Add a Recipe (RECIPE&#45;5)</text>
<text xml:space="preserve" text-anchor="start" x="1233.3" y="-1213.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="895.33" y="-1235" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the feature gate for</text>
<text xml:space="preserve" text-anchor="start" x="895.33" y="-1217" font-family="Arial" font-size="15.00" fill="#ffffff">one complete user&#45;facing flow: a</text>
<text xml:space="preserve" text-anchor="start" x="895.33" y="-1199" font-family="Arial" font-size="15.00" fill="#ffffff">user writes a recipe and sees it in</text>
<text xml:space="preserve" text-anchor="start" x="895.33" y="-1181" font-family="Arial" font-size="15.00" fill="#ffffff">the box. Human closes it once</text>
<text xml:space="preserve" text-anchor="start" x="895.33" y="-1163" font-family="Arial" font-size="15.00" fill="#ffffff">feature&#45;review is done.Branch:</text>
</g>
<!-- featb -->
<g id="node12" class="node">
<title>featb</title>
<polygon fill="#d97706" stroke="#ac5300" stroke-width="0" points="1269.2,-1019 789.37,-1019 789.37,-839 1269.2,-839 1269.2,-1019"/>
<text xml:space="preserve" text-anchor="start" x="837.49" y="-923.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="881.43" y="-968" font-family="Arial" font-size="20.00" fill="#ffffff">Feature — Search the Box (RECIPE&#45;11)</text>
<text xml:space="preserve" text-anchor="start" x="1247.19" y="-923.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="881.43" y="-945" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the feature gate for</text>
<text xml:space="preserve" text-anchor="start" x="881.43" y="-927" font-family="Arial" font-size="15.00" fill="#ffffff">one complete user&#45;facing flow: a</text>
<text xml:space="preserve" text-anchor="start" x="881.43" y="-909" font-family="Arial" font-size="15.00" fill="#ffffff">user searches saved recipes by</text>
<text xml:space="preserve" text-anchor="start" x="881.43" y="-891" font-family="Arial" font-size="15.00" fill="#ffffff">title and ingredient. Human closes</text>
<text xml:space="preserve" text-anchor="start" x="881.43" y="-873" font-family="Arial" font-size="15.00" fill="#ffffff">it once its review is done.Branch:</text>
</g>
<!-- engineer&#45;&gt;beads -->
<g id="edge1" class="edge">
<title>engineer&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M355.83,-482.68C464.2,-480.87 605.42,-474.49 729.37,-456 765.19,-450.66 802.95,-442.83 839.13,-434.21"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="839.67,-436.78 846.34,-432.47 838.44,-431.67 839.67,-436.78"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="427.34,-484.22 427.34,-523.82 451.34,-523.82 451.34,-484.22 427.34,-484.22"/>
<text xml:space="preserve" text-anchor="start" x="435.44" y="-500.82" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">0</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="454.34,-484.22 454.34,-523.82 717.94,-523.82 717.94,-484.22 454.34,-484.22"/>
<text xml:space="preserve" text-anchor="start" x="457.34" y="-506.82" font-family="Arial" font-size="14.00" fill="#c9c9c9">bd heartbeat RECIPE&#45;6 — keep the lease</text>
<text xml:space="preserve" text-anchor="start" x="571.74" y="-490.02" font-family="Arial" font-size="14.00" fill="#c9c9c9">alive</text>
</g>
<!-- engineer&#45;&gt;beads -->
<g id="edge2" class="edge">
<title>engineer&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M339.17,-392.11C364.19,-381.59 390.27,-372.51 415.9,-366.6 555.12,-334.5 716.87,-339.78 839.17,-352.05"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="838.65,-354.64 846.37,-352.79 839.18,-349.42 838.65,-354.64"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="439.82,-369.6 439.82,-426 463.82,-426 463.82,-369.6 439.82,-369.6"/>
<text xml:space="preserve" text-anchor="start" x="447.93" y="-394.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="466.82,-369.6 466.82,-426 705.45,-426 705.45,-369.6 466.82,-369.6"/>
<text xml:space="preserve" text-anchor="start" x="469.82" y="-409" font-family="Arial" font-size="14.00" fill="#c9c9c9">writes src/recipes/validate&#45;recipe.ts in</text>
<text xml:space="preserve" text-anchor="start" x="470.99" y="-392.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">the worktree — never commits, never</text>
<text xml:space="preserve" text-anchor="start" x="557.34" y="-375.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">branches</text>
</g>
<!-- engineer&#45;&gt;beads -->
<g id="edge3" class="edge">
<title>engineer&#45;&gt;beads</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M250.74,-392.06C293.26,-346.2 351.36,-295.02 415.9,-270.4 552.61,-218.24 716.12,-251.98 839.78,-295.31"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="838.56,-297.66 846.51,-297.7 840.32,-292.72 838.56,-297.66"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="420.35,-273.4 420.35,-313 444.35,-313 444.35,-273.4 420.35,-273.4"/>
<text xml:space="preserve" text-anchor="start" x="428.45" y="-290" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="447.35,-273.4 447.35,-313 724.93,-313 724.93,-273.4 447.35,-273.4"/>
<text xml:space="preserve" text-anchor="start" x="450.35" y="-296" font-family="Arial" font-size="14.00" fill="#c9c9c9">final action: touch $BO_DONE_FILE — only</text>
<text xml:space="preserve" text-anchor="start" x="486.14" y="-279.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">if the brief is genuinely complete</text>
</g>
<!-- engineer&#45;&gt;hook -->
<g id="edge4" class="edge">
<title>engineer&#45;&gt;hook</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M365.7,-543.02C382.56,-547.23 399.46,-550.99 415.9,-554 865.25,-636.41 1399.71,-643.68 1706.96,-639.32"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="366.63,-540.55 358.71,-541.24 365.33,-545.63 366.63,-540.55"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="983.22,-637.95 983.22,-670.75 1007.22,-670.75 1007.22,-637.95 983.22,-637.95"/>
<text xml:space="preserve" text-anchor="start" x="991.32" y="-651.15" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1010.22,-637.95 1010.22,-670.75 1075.36,-670.75 1075.36,-637.95 1010.22,-637.95"/>
<text xml:space="preserve" text-anchor="start" x="1013.22" y="-648.75" font-family="Arial" font-size="14.00" fill="#c9c9c9">Stop fires</text>
</g>
<!-- beads&#45;&gt;hook -->
<g id="edge6" class="edge">
<title>beads&#45;&gt;hook</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1219.27,-431.31C1359.84,-469.48 1553.11,-521.96 1706.76,-563.68"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1220.08,-428.81 1212.16,-429.38 1218.71,-433.88 1220.08,-428.81"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1332.2,-546.3 1332.2,-585.9 1356.2,-585.9 1356.2,-546.3 1332.2,-546.3"/>
<text xml:space="preserve" text-anchor="start" x="1340.31" y="-562.9" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1359.2,-546.3 1359.2,-585.9 1643.75,-585.9 1643.75,-546.3 1359.2,-546.3"/>
<text xml:space="preserve" text-anchor="start" x="1362.2" y="-568.9" font-family="Arial" font-size="14.00" fill="#c9c9c9">RECIPE&#45;6 stays claimed; RECIPE&#45;7 chained</text>
<text xml:space="preserve" text-anchor="start" x="1457.12" y="-552.1" font-family="Arial" font-size="14.00" fill="#c9c9c9">behind it waits</text>
</g>
<!-- beads&#45;&gt;hook -->
<g id="edge8" class="edge">
<title>beads&#45;&gt;hook</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1219.67,-352.36C1344.5,-341.45 1509.63,-341.15 1646.75,-389.4 1734.55,-420.3 1816.87,-486.64 1874.83,-542.15"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1219.49,-349.74 1212.26,-353.03 1219.96,-354.97 1219.49,-349.74"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1337.44,-392.4 1337.44,-432 1361.44,-432 1361.44,-392.4 1337.44,-392.4"/>
<text xml:space="preserve" text-anchor="start" x="1345.55" y="-409" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">7</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1364.44,-392.4 1364.44,-432 1638.51,-432 1638.51,-392.4 1364.44,-392.4"/>
<text xml:space="preserve" text-anchor="start" x="1367.44" y="-415" font-family="Arial" font-size="14.00" fill="#c9c9c9">write metadata pr=… onto RECIPE&#45;6, close</text>
<text xml:space="preserve" text-anchor="start" x="1476.96" y="-398.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">the task</text>
</g>
<!-- beads&#45;&gt;testerunit -->
<g id="edge12" class="edge">
<title>beads&#45;&gt;testerunit</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1206.75,-290.89C1340.27,-228.53 1530.18,-150.46 1706.75,-116 2348.22,9.17 3131.15,-39.77 3476.73,-71.32"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1205.65,-288.5 1199.98,-294.06 1207.88,-293.25 1205.65,-288.5"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2285.66,-49.92 2285.66,-106.32 2317.23,-106.32 2317.23,-49.92 2285.66,-49.92"/>
<text xml:space="preserve" text-anchor="start" x="2293.66" y="-74.92" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">11</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2320.23,-49.92 2320.23,-106.32 2563.57,-106.32 2563.57,-49.92 2320.23,-49.92"/>
<text xml:space="preserve" text-anchor="start" x="2323.23" y="-89.32" font-family="Arial" font-size="14.00" fill="#c9c9c9">covers every branch of validateRecipe</text>
<text xml:space="preserve" text-anchor="start" x="2345.83" y="-72.52" font-family="Arial" font-size="14.00" fill="#c9c9c9">(framework&#45;jest), commits onto</text>
<text xml:space="preserve" text-anchor="start" x="2345.4" y="-55.72" font-family="Arial" font-size="14.00" fill="#c9c9c9">feature/add&#45;recipe via the hook</text>
</g>
<!-- hook&#45;&gt;notdeclareddone -->
<g id="edge5" class="edge">
<title>hook&#45;&gt;notdeclareddone</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M2211.9,-690.77C2342.3,-721.25 2500.36,-758.19 2627.12,-787.81"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="2626.5,-790.36 2634.4,-789.51 2627.69,-785.25 2626.5,-790.36"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2290.8,-776.4 2290.8,-816 2314.8,-816 2314.8,-776.4 2290.8,-776.4"/>
<text xml:space="preserve" text-anchor="start" x="2298.91" y="-793" font-family="Arial" font-weight="bold" font-size="14.00" fill="#fffff3">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2317.8,-776.4 2317.8,-816 2558.43,-816 2558.43,-776.4 2317.8,-776.4"/>
<text xml:space="preserve" text-anchor="start" x="2320.8" y="-799" font-family="Arial" font-size="14.00" fill="#fffff3">ERROR reason=not&#45;declared&#45;done —</text>
<text xml:space="preserve" text-anchor="start" x="2406.6" y="-782.2" font-family="Arial" font-size="14.00" fill="#fffff3">fail&#45;closed</text>
</g>
<!-- hook&#45;&gt;origin -->
<g id="edge7" class="edge">
<title>hook&#45;&gt;origin</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2149.5,-542.07C2189.74,-523.58 2232.14,-504.59 2272.06,-487.6 2403.19,-431.79 2553.09,-373.61 2668.01,-330.18"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2668.7,-332.73 2674.79,-327.63 2666.84,-327.82 2668.7,-332.73"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2275.06,-490.6 2275.06,-547 2299.06,-547 2299.06,-490.6 2275.06,-490.6"/>
<text xml:space="preserve" text-anchor="start" x="2283.16" y="-515.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2302.06,-490.6 2302.06,-547 2574.17,-547 2574.17,-490.6 2302.06,-490.6"/>
<text xml:space="preserve" text-anchor="start" x="2305.06" y="-530" font-family="Arial" font-size="14.00" fill="#c9c9c9">commit RECIPE&#45;6 onto feature/add&#45;recipe,</text>
<text xml:space="preserve" text-anchor="start" x="2317.49" y="-513.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">push, open PR base epic/recipe&#45;box —</text>
<text xml:space="preserve" text-anchor="start" x="2346.28" y="-496.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">once per branch, reused after</text>
</g>
<!-- hook&#45;&gt;noprtarget -->
<g id="edge9" class="edge">
<title>hook&#45;&gt;noprtarget</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M2211.9,-609.22C2352.5,-596.49 2525.26,-580.84 2656.26,-568.97"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="2656.16,-571.62 2663.4,-568.33 2655.69,-566.39 2656.16,-571.62"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2277.59,-606.49 2277.59,-646.09 2301.59,-646.09 2301.59,-606.49 2277.59,-606.49"/>
<text xml:space="preserve" text-anchor="start" x="2285.69" y="-623.09" font-family="Arial" font-weight="bold" font-size="14.00" fill="#fffff3">8</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2304.59,-606.49 2304.59,-646.09 2571.64,-646.09 2571.64,-606.49 2304.59,-606.49"/>
<text xml:space="preserve" text-anchor="start" x="2307.59" y="-629.09" font-family="Arial" font-size="14.00" fill="#fffff3">ERROR reason=no&#45;pr&#45;target — named for</text>
<text xml:space="preserve" text-anchor="start" x="2321" y="-612.29" font-family="Arial" font-size="14.00" fill="#fffff3">the target, since pr now means the url</text>
</g>
<!-- hook&#45;&gt;dispatcher -->
<g id="edge10" class="edge">
<title>hook&#45;&gt;dispatcher</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2082.42,-721.93C2138.87,-761.93 2207.58,-808.37 2272.06,-846 2393.26,-916.74 2534.53,-986.15 2647.62,-1038.75"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2646.43,-1041.1 2654.34,-1041.87 2648.64,-1036.33 2646.43,-1041.1"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2296.44,-1004.86 2296.44,-1044.46 2320.44,-1044.46 2320.44,-1004.86 2296.44,-1004.86"/>
<text xml:space="preserve" text-anchor="start" x="2304.55" y="-1021.46" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">9</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2323.44,-1004.86 2323.44,-1044.46 2552.79,-1044.46 2552.79,-1004.86 2323.44,-1004.86"/>
<text xml:space="preserve" text-anchor="start" x="2326.44" y="-1027.46" font-family="Arial" font-size="14.00" fill="#c9c9c9">the line opens one ticket: RECIPE&#45;7</text>
<text xml:space="preserve" text-anchor="start" x="2374.31" y="-1010.66" font-family="Arial" font-size="14.00" fill="#c9c9c9">becomes the frontier</text>
</g>
<!-- reviewagent&#45;&gt;origin -->
<g id="edge13" class="edge">
<title>reviewagent&#45;&gt;origin</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2139.1,-246.08C2182.58,-243.05 2228.96,-240.33 2272.06,-238.8 2407.58,-233.98 2441.67,-233.39 2577.17,-238.8 2606.46,-239.97 2637.45,-241.83 2667.69,-243.99"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2667.22,-246.59 2674.89,-244.51 2667.6,-241.35 2667.22,-246.59"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2297.72,-241.8 2297.72,-315 2329.29,-315 2329.29,-241.8 2297.72,-241.8"/>
<text xml:space="preserve" text-anchor="start" x="2305.72" y="-275.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">12</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2332.29,-241.8 2332.29,-315 2551.52,-315 2551.52,-241.8 2332.29,-241.8"/>
<text xml:space="preserve" text-anchor="start" x="2336.47" y="-298" font-family="Arial" font-size="14.00" fill="#c9c9c9">feature&#45;review: maps entry to exit,</text>
<text xml:space="preserve" text-anchor="start" x="2356.69" y="-281.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">trace logs, tests against the</text>
<text xml:space="preserve" text-anchor="start" x="2335.29" y="-264.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">instrumented code, findings as PR</text>
<text xml:space="preserve" text-anchor="start" x="2409.62" y="-247.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">comments</text>
</g>
<!-- dispatcher&#45;&gt;testerunit -->
<g id="edge11" class="edge">
<title>dispatcher&#45;&gt;testerunit</title>
<path fill="none" stroke="#1c4ab0" stroke-width="2" stroke-dasharray="5,2" d="M3009.22,-1041.07C3032.26,-1024.25 3054.8,-1005.7 3074.25,-986 3321.24,-735.87 3521.06,-364.74 3608.1,-189.06"/>
<polygon fill="#1c4ab0" stroke="#1c4ab0" stroke-width="2" points="3610.36,-190.43 3611.32,-182.54 3605.65,-188.1 3610.36,-190.43"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="3137.25,-904.11 3137.25,-977.31 3168.82,-977.31 3168.82,-904.11 3137.25,-904.11"/>
<text xml:space="preserve" text-anchor="start" x="3145.25" y="-937.51" font-family="Arial" font-weight="bold" font-size="14.00" fill="#f1ffff">10</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="3171.82,-904.11 3171.82,-977.31 3413.62,-977.31 3413.62,-904.11 3171.82,-904.11"/>
<text xml:space="preserve" text-anchor="start" x="3189.44" y="-960.31" font-family="Arial" font-size="14.00" fill="#f1ffff">AGENT[unit&#45;tests] = tester&#45;unit —</text>
<text xml:space="preserve" text-anchor="start" x="3174.82" y="-943.51" font-family="Arial" font-size="14.00" fill="#f1ffff">respawn means a fresh session of the</text>
<text xml:space="preserve" text-anchor="start" x="3175.6" y="-926.71" font-family="Arial" font-size="14.00" fill="#f1ffff">SAME agent re&#45;checks inside the one</text>
<text xml:space="preserve" text-anchor="start" x="3276.38" y="-909.91" font-family="Arial" font-size="14.00" fill="#f1ffff">ticket</text>
</g>
<!-- human&#45;&gt;feata -->
<g id="edge14" class="edge">
<title>human&#45;&gt;feata</title>
<path fill="none" stroke="#a35905" stroke-width="2" stroke-dasharray="5,2" d="M354.93,-1104.04C481.85,-1125.71 654.53,-1155.19 793.25,-1178.87"/>
<polygon fill="#a35905" stroke="#a35905" stroke-width="2" points="792.78,-1181.46 800.61,-1180.13 793.66,-1176.28 792.78,-1181.46"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="418.9,-1170.96 418.9,-1227.36 450.48,-1227.36 450.48,-1170.96 418.9,-1170.96"/>
<text xml:space="preserve" text-anchor="start" x="426.9" y="-1195.96" font-family="Arial" font-weight="bold" font-size="14.00" fill="#ffffff">13</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="453.48,-1170.96 453.48,-1227.36 726.37,-1227.36 726.37,-1170.96 453.48,-1170.96"/>
<text xml:space="preserve" text-anchor="start" x="486.43" y="-1210.36" font-family="Arial" font-size="14.00" fill="#ffffff">reads the report, verifies the flow,</text>
<text xml:space="preserve" text-anchor="start" x="456.48" y="-1193.56" font-family="Arial" font-size="14.00" fill="#ffffff">closes RECIPE&#45;5 — only a human closes a</text>
<text xml:space="preserve" text-anchor="start" x="576.3" y="-1176.76" font-family="Arial" font-size="14.00" fill="#ffffff">gate</text>
</g>
<!-- human&#45;&gt;featb -->
<g id="edge15" class="edge">
<title>human&#45;&gt;featb</title>
<path fill="none" stroke="#a35905" stroke-width="2" stroke-dasharray="5,2" d="M354.93,-1043.96C477.71,-1023 643.3,-994.73 779.54,-971.47"/>
<polygon fill="#a35905" stroke="#a35905" stroke-width="2" points="779.78,-974.09 786.73,-970.24 778.89,-968.91 779.78,-974.09"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="477.27,-1034.15 477.27,-1066.95 508.84,-1066.95 508.84,-1034.15 477.27,-1034.15"/>
<text xml:space="preserve" text-anchor="start" x="485.27" y="-1047.35" font-family="Arial" font-weight="bold" font-size="14.00" fill="#ffffff">14</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="511.84,-1034.15 511.84,-1066.95 668,-1066.95 668,-1034.15 511.84,-1034.15"/>
<text xml:space="preserve" text-anchor="start" x="514.84" y="-1044.95" font-family="Arial" font-size="14.00" fill="#ffffff">verify, close RECIPE&#45;11</text>
</g>
</g>
</svg>
`;case`epicTier`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 16.1.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="2014pt" height="1080pt"
 viewBox="0.00 0.00 2014.00 1080.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1065.05)">
<!-- dispatcher -->
<g id="node1" class="node">
<title>dispatcher</title>
<polygon fill="#2563eb" stroke="#0042c2" stroke-width="0" points="397.46,-470 0,-470 0,-290 397.46,-290 397.46,-470"/>
<text xml:space="preserve" text-anchor="start" x="68.06" y="-374.4" font-family="Arial" font-size="14.00" fill="#f1ffff"> </text>
<text xml:space="preserve" text-anchor="start" x="112.01" y="-419" font-family="Arial" font-size="20.00" fill="#f1ffff">bo loop — the dispatcher</text>
<text xml:space="preserve" text-anchor="start" x="355.51" y="-374.4" font-family="Arial" font-size="14.00" fill="#f1ffff"> </text>
<text xml:space="preserve" text-anchor="start" x="112.01" y="-396" font-family="Arial" font-size="15.00" fill="#ddf2ff">What it is: CLI/beads&#45;loop.sh — the</text>
<text xml:space="preserve" text-anchor="start" x="112.01" y="-378" font-family="Arial" font-size="15.00" fill="#ddf2ff">one command (bo loop) that turns</text>
<text xml:space="preserve" text-anchor="start" x="112.01" y="-360" font-family="Arial" font-size="15.00" fill="#ddf2ff">beads tickets into background</text>
<text xml:space="preserve" text-anchor="start" x="112.01" y="-342" font-family="Arial" font-size="15.00" fill="#ddf2ff">workers.Steps it runs, one per</text>
<text xml:space="preserve" text-anchor="start" x="112.01" y="-324" font-family="Arial" font-size="15.00" fill="#ddf2ff">tick:reads the branches already at</text>
</g>
<!-- mergeagent -->
<g id="node2" class="node">
<title>mergeagent</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="1200.27,-760 846.01,-760 846.01,-580 1200.27,-580 1200.27,-760"/>
<text xml:space="preserve" text-anchor="start" x="894.13" y="-664.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="938.08" y="-709" font-family="Arial" font-size="20.00" fill="#ffffff">merge</text>
<text xml:space="preserve" text-anchor="start" x="1178.26" y="-664.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="938.08" y="-686" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the epic&#45;tier assembler</text>
<text xml:space="preserve" text-anchor="start" x="938.08" y="-668" font-family="Arial" font-size="15.00" fill="#ffffff">— reads the feature branches off</text>
<text xml:space="preserve" text-anchor="start" x="938.08" y="-650" font-family="Arial" font-size="15.00" fill="#ffffff">the feature gates, assembles them</text>
<text xml:space="preserve" text-anchor="start" x="938.08" y="-632" font-family="Arial" font-size="15.00" fill="#ffffff">onto the epic branch in its own</text>
<text xml:space="preserve" text-anchor="start" x="938.08" y="-614" font-family="Arial" font-size="15.00" fill="#ffffff">worktree, resolves the conflicts</text>
</g>
<!-- origin -->
<g id="node3" class="node">
<title>origin</title>
<path fill="#6b7280" stroke="#484f5c" stroke-width="2" d="M1983.65,-743.64C1983.65,-752.67 1904.26,-760 1806.53,-760 1708.8,-760 1629.41,-752.67 1629.41,-743.64 1629.41,-743.64 1629.41,-596.36 1629.41,-596.36 1629.41,-587.33 1708.8,-580 1806.53,-580 1904.26,-580 1983.65,-587.33 1983.65,-596.36 1983.65,-596.36 1983.65,-743.64 1983.65,-743.64"/>
<path fill="none" stroke="#484f5c" stroke-width="2" d="M1983.65,-743.64C1983.65,-734.61 1904.26,-727.27 1806.53,-727.27 1708.8,-727.27 1629.41,-734.61 1629.41,-743.64"/>
<text xml:space="preserve" text-anchor="start" x="1677.53" y="-664.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1721.48" y="-709" font-family="Arial" font-size="20.00" fill="#ffffff">origin — GitHub</text>
<text xml:space="preserve" text-anchor="start" x="1961.64" y="-664.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1721.48" y="-686" font-family="Arial" font-size="15.00" fill="#fdffff">What it is: the remote the tower</text>
<text xml:space="preserve" text-anchor="start" x="1721.48" y="-668" font-family="Arial" font-size="15.00" fill="#fdffff">publishes to. main at the bottom,</text>
<text xml:space="preserve" text-anchor="start" x="1721.48" y="-650" font-family="Arial" font-size="15.00" fill="#fdffff">one PR per branch above it:</text>
<text xml:space="preserve" text-anchor="start" x="1721.48" y="-632" font-family="Arial" font-size="15.00" fill="#fdffff">feature/&lt;slug&gt; → PR → the epic</text>
<text xml:space="preserve" text-anchor="start" x="1721.48" y="-614" font-family="Arial" font-size="15.00" fill="#fdffff">branch, epic/&lt;slug&gt; → PR → main.</text>
</g>
<!-- testere2e -->
<g id="node4" class="node">
<title>testere2e</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="1193.18,-470 853.1,-470 853.1,-290 1193.18,-290 1193.18,-470"/>
<text xml:space="preserve" text-anchor="start" x="901.22" y="-374.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="945.17" y="-428.8" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;e2e</text>
<text xml:space="preserve" text-anchor="start" x="1171.17" y="-374.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="945.17" y="-407.8" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="945.17" y="-386.2" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the broad tier —</text>
<text xml:space="preserve" text-anchor="start" x="945.17" y="-368.2" font-family="Arial" font-size="15.00" fill="#ffffff">journeys across features on the</text>
<text xml:space="preserve" text-anchor="start" x="945.17" y="-350.2" font-family="Arial" font-size="15.00" fill="#ffffff">real stack; cross&#45;feature state;</text>
<text xml:space="preserve" text-anchor="start" x="945.17" y="-332.2" font-family="Arial" font-size="15.00" fill="#ffffff">one success + one failure per</text>
<text xml:space="preserve" text-anchor="start" x="945.17" y="-314.2" font-family="Arial" font-size="15.00" fill="#ffffff">feature. Label epic&#45;e2e&#45;test, skill</text>
</g>
<!-- reviewagent -->
<g id="node5" class="node">
<title>reviewagent</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="1203.19,-180 843.09,-180 843.09,0 1203.19,0 1203.19,-180"/>
<text xml:space="preserve" text-anchor="start" x="891.21" y="-84.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="935.15" y="-129" font-family="Arial" font-size="20.00" fill="#ffffff">review</text>
<text xml:space="preserve" text-anchor="start" x="1181.18" y="-84.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="935.15" y="-106" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the reviewer — three</text>
<text xml:space="preserve" text-anchor="start" x="935.15" y="-88" font-family="Arial" font-size="15.00" fill="#ffffff">questions from first principles:</text>
<text xml:space="preserve" text-anchor="start" x="935.15" y="-70" font-family="Arial" font-size="15.00" fill="#ffffff">does the code do what its source of</text>
<text xml:space="preserve" text-anchor="start" x="935.15" y="-52" font-family="Arial" font-size="15.00" fill="#ffffff">truth demands, do the tests prove</text>
<text xml:space="preserve" text-anchor="start" x="935.15" y="-34" font-family="Arial" font-size="15.00" fill="#ffffff">it, is it simple and readable. Maps</text>
</g>
<!-- human -->
<g id="node6" class="node">
<title>human</title>
<polygon fill="#6b7280" stroke="#484f5c" stroke-width="0" points="375.85,-1050 21.61,-1050 21.61,-870 375.85,-870 375.85,-1050"/>
<text xml:space="preserve" text-anchor="start" x="69.73" y="-954.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="113.67" y="-999" font-family="Arial" font-size="20.00" fill="#ffffff">Human (Brodie)</text>
<text xml:space="preserve" text-anchor="start" x="353.84" y="-954.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="113.67" y="-976" font-family="Arial" font-size="15.00" fill="#fdffff">What it is: the only one who closes</text>
<text xml:space="preserve" text-anchor="start" x="113.67" y="-958" font-family="Arial" font-size="15.00" fill="#fdffff">gates. Workers leave their tickets</text>
<text xml:space="preserve" text-anchor="start" x="113.67" y="-940" font-family="Arial" font-size="15.00" fill="#fdffff">open and report in their final</text>
<text xml:space="preserve" text-anchor="start" x="113.67" y="-922" font-family="Arial" font-size="15.00" fill="#fdffff">message; the human reads the</text>
<text xml:space="preserve" text-anchor="start" x="113.67" y="-904" font-family="Arial" font-size="15.00" fill="#fdffff">report, verifies the branch, and</text>
</g>
<!-- epic -->
<g id="node7" class="node">
<title>epic</title>
<polygon fill="#d97706" stroke="#ac5300" stroke-width="0" points="1225.25,-1050 821.03,-1050 821.03,-870 1225.25,-870 1225.25,-1050"/>
<text xml:space="preserve" text-anchor="start" x="869.15" y="-954.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="913.1" y="-999" font-family="Arial" font-size="20.00" fill="#ffffff">Epic — Recipe Box (RECIPE&#45;1)</text>
<text xml:space="preserve" text-anchor="start" x="1203.24" y="-954.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="913.1" y="-976" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the epic gate — the</text>
<text xml:space="preserve" text-anchor="start" x="913.1" y="-958" font-family="Arial" font-size="15.00" fill="#ffffff">&quot;what&quot;; the human closes it once,</text>
<text xml:space="preserve" text-anchor="start" x="913.1" y="-940" font-family="Arial" font-size="15.00" fill="#ffffff">after epic&#45;review is done.Branch:</text>
<text xml:space="preserve" text-anchor="start" x="913.1" y="-922" font-family="Arial" font-size="15.00" fill="#ffffff">epic/recipe&#45;box → PR → main (the</text>
<text xml:space="preserve" text-anchor="start" x="913.1" y="-904" font-family="Arial" font-size="15.00" fill="#ffffff">loop publishes it and writes pr as</text>
</g>
<!-- dispatcher&#45;&gt;mergeagent -->
<g id="edge1" class="edge">
<title>dispatcher&#45;&gt;mergeagent</title>
<path fill="none" stroke="#1c4ab0" stroke-width="2" stroke-dasharray="5,2" d="M397.24,-449.65C530.65,-496.69 705.63,-558.39 836.48,-604.53"/>
<polygon fill="#1c4ab0" stroke="#1c4ab0" stroke-width="2" points="835.42,-606.94 843.37,-606.96 837.17,-601.99 835.42,-606.94"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="483.8,-579.2 483.8,-635.6 507.8,-635.6 507.8,-579.2 483.8,-579.2"/>
<text xml:space="preserve" text-anchor="start" x="491.91" y="-604.2" font-family="Arial" font-weight="bold" font-size="14.00" fill="#f1ffff">0</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="510.8,-579.2 510.8,-635.6 734.69,-635.6 734.69,-579.2 510.8,-579.2"/>
<text xml:space="preserve" text-anchor="start" x="516.54" y="-618.6" font-family="Arial" font-size="14.00" fill="#f1ffff">RECIPE&#45;2 epic&#45;merge&#45;pr is on the</text>
<text xml:space="preserve" text-anchor="start" x="513.8" y="-601.8" font-family="Arial" font-size="14.00" fill="#f1ffff">frontier — dispatched like any other</text>
<text xml:space="preserve" text-anchor="start" x="603.68" y="-585" font-family="Arial" font-size="14.00" fill="#f1ffff">stamp</text>
</g>
<!-- dispatcher&#45;&gt;testere2e -->
<g id="edge3" class="edge">
<title>dispatcher&#45;&gt;testere2e</title>
<path fill="none" stroke="#1c4ab0" stroke-width="2" stroke-dasharray="5,2" d="M397.24,-380C532.95,-380 711.67,-380 843.2,-380"/>
<polygon fill="#1c4ab0" stroke="#1c4ab0" stroke-width="2" points="842.86,-382.63 850.36,-380 842.86,-377.38 842.86,-382.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="460.46,-383 460.46,-422.6 484.46,-422.6 484.46,-383 460.46,-383"/>
<text xml:space="preserve" text-anchor="start" x="468.57" y="-399.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#f1ffff">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="487.46,-383 487.46,-422.6 758.03,-422.6 758.03,-383 487.46,-383"/>
<text xml:space="preserve" text-anchor="start" x="490.46" y="-405.6" font-family="Arial" font-size="14.00" fill="#f1ffff">RECIPE&#45;3 epic&#45;e2e&#45;test — journeys on the</text>
<text xml:space="preserve" text-anchor="start" x="592.79" y="-388.8" font-family="Arial" font-size="14.00" fill="#f1ffff">real stack</text>
</g>
<!-- dispatcher&#45;&gt;reviewagent -->
<g id="edge4" class="edge">
<title>dispatcher&#45;&gt;reviewagent</title>
<path fill="none" stroke="#1c4ab0" stroke-width="2" stroke-dasharray="5,2" d="M397.24,-310.35C529.61,-263.68 702.89,-202.57 833.4,-156.55"/>
<polygon fill="#1c4ab0" stroke="#1c4ab0" stroke-width="2" points="834.06,-159.1 840.26,-154.13 832.32,-154.15 834.06,-159.1"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="465.53,-289.2 465.53,-328.8 489.53,-328.8 489.53,-289.2 465.53,-289.2"/>
<text xml:space="preserve" text-anchor="start" x="473.63" y="-305.8" font-family="Arial" font-weight="bold" font-size="14.00" fill="#f1ffff">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="492.53,-289.2 492.53,-328.8 752.97,-328.8 752.97,-289.2 492.53,-289.2"/>
<text xml:space="preserve" text-anchor="start" x="495.53" y="-311.8" font-family="Arial" font-size="14.00" fill="#f1ffff">RECIPE&#45;4 epic&#45;review — three questions</text>
<text xml:space="preserve" text-anchor="start" x="564.01" y="-295" font-family="Arial" font-size="14.00" fill="#f1ffff">from first principles</text>
</g>
<!-- mergeagent&#45;&gt;origin -->
<g id="edge2" class="edge">
<title>mergeagent&#45;&gt;origin</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1199.99,-670C1324.54,-670 1491.37,-670 1618.38,-670"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1618.08,-672.63 1625.58,-670 1618.08,-667.38 1618.08,-672.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1288.25,-673 1288.25,-729.4 1312.25,-729.4 1312.25,-673 1288.25,-673"/>
<text xml:space="preserve" text-anchor="start" x="1296.35" y="-698" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1315.25,-673 1315.25,-729.4 1566.41,-729.4 1566.41,-673 1315.25,-673"/>
<text xml:space="preserve" text-anchor="start" x="1318.25" y="-712.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">read the feature branches off the gates,</text>
<text xml:space="preserve" text-anchor="start" x="1319.43" y="-695.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">assemble onto epic/recipe&#45;box, resolve</text>
<text xml:space="preserve" text-anchor="start" x="1339.28" y="-678.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">the conflicts, run the tests, report</text>
</g>
<!-- human&#45;&gt;epic -->
<g id="edge5" class="edge">
<title>human&#45;&gt;epic</title>
<path fill="none" stroke="#a35905" stroke-width="2" stroke-dasharray="5,2" d="M375.65,-960C503.04,-960 675.83,-960 810.72,-960"/>
<polygon fill="#a35905" stroke="#a35905" stroke-width="2" points="810.66,-962.63 818.16,-960 810.66,-957.38 810.66,-962.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="470.96,-963 470.96,-1002.6 494.96,-1002.6 494.96,-963 470.96,-963"/>
<text xml:space="preserve" text-anchor="start" x="479.07" y="-979.6" font-family="Arial" font-weight="bold" font-size="14.00" fill="#ffffff">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="497.96,-963 497.96,-1002.6 747.53,-1002.6 747.53,-963 497.96,-963"/>
<text xml:space="preserve" text-anchor="start" x="500.96" y="-985.6" font-family="Arial" font-size="14.00" fill="#ffffff">verify, close the epic gate — thumbs&#45;up</text>
<text xml:space="preserve" text-anchor="start" x="535.59" y="-968.8" font-family="Arial" font-size="14.00" fill="#ffffff">on the merged PR into main</text>
</g>
</g>
</svg>
`;case`stageBackends`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 16.1.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1014pt" height="680pt"
 viewBox="0.00 0.00 1014.00 680.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 665.05)">
<g id="clust1" class="cluster">
<title>cluster_wta</title>
<polygon fill="#0c513c" stroke="#073c28" points="8,-8 8,-642 476,-642 476,-8 8,-8"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-629.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#eeffff" fill-opacity="0.701961">FEATURE+ADD&#45;RECIPE → FEATURE/ADD&#45;RECIPE</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_wtb</title>
<polygon fill="#0c513c" stroke="#073c28" points="506,-8 506,-642 976,-642 976,-8 506,-8"/>
<text xml:space="preserve" text-anchor="start" x="514" y="-629.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#eeffff" fill-opacity="0.701961">FEATURE+SEARCH&#45;RECIPES → FEATURE/SEARCH&#45;RECIPES</text>
</g>
<!-- enga -->
<g id="node1" class="node">
<title>enga</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="419.95,-570.8 64.05,-570.8 64.05,-390.8 419.95,-390.8 419.95,-570.8"/>
<text xml:space="preserve" text-anchor="start" x="112.17" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="156.11" y="-519.8" font-family="Arial" font-size="20.00" fill="#ffffff">engineer</text>
<text xml:space="preserve" text-anchor="start" x="397.94" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="156.11" y="-496.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the back&#45;end worker —</text>
<text xml:space="preserve" text-anchor="start" x="156.11" y="-478.8" font-family="Arial" font-size="15.00" fill="#ffffff">business logic, endpoints, hooks,</text>
<text xml:space="preserve" text-anchor="start" x="156.11" y="-460.8" font-family="Arial" font-size="15.00" fill="#ffffff">types, error factories. Spawned s b</text>
<text xml:space="preserve" text-anchor="start" x="156.11" y="-442.8" font-family="Arial" font-size="15.00" fill="#ffffff">w, certified by respawn. Never</text>
<text xml:space="preserve" text-anchor="start" x="156.11" y="-424.8" font-family="Arial" font-size="15.00" fill="#ffffff">writes tests, JSX, or CSS.</text>
</g>
<!-- engb -->
<g id="node2" class="node">
<title>engb</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="918.95,-570.8 563.05,-570.8 563.05,-390.8 918.95,-390.8 918.95,-570.8"/>
<text xml:space="preserve" text-anchor="start" x="611.17" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="655.11" y="-519.8" font-family="Arial" font-size="20.00" fill="#ffffff">engineer</text>
<text xml:space="preserve" text-anchor="start" x="896.94" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="655.11" y="-496.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the back&#45;end worker —</text>
<text xml:space="preserve" text-anchor="start" x="655.11" y="-478.8" font-family="Arial" font-size="15.00" fill="#ffffff">business logic, endpoints, hooks,</text>
<text xml:space="preserve" text-anchor="start" x="655.11" y="-460.8" font-family="Arial" font-size="15.00" fill="#ffffff">types, error factories. Spawned s b</text>
<text xml:space="preserve" text-anchor="start" x="655.11" y="-442.8" font-family="Arial" font-size="15.00" fill="#ffffff">w, certified by respawn. Never</text>
<text xml:space="preserve" text-anchor="start" x="655.11" y="-424.8" font-family="Arial" font-size="15.00" fill="#ffffff">writes tests, JSX, or CSS.</text>
</g>
<!-- t_backenda -->
<g id="node3" class="node">
<title>t_backenda</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="426.43,-238 57.57,-238 57.57,-58 426.43,-58 426.43,-238"/>
<text xml:space="preserve" text-anchor="start" x="105.69" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="149.64" y="-187" font-family="Arial" font-size="20.00" fill="#ffffff">backend&#45;logic (RECIPE&#45;6)</text>
<text xml:space="preserve" text-anchor="start" x="404.42" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="149.64" y="-164" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="149.64" y="-146" font-family="Arial" font-size="15.00" fill="#f6ffff">validateRecipe + saveRecipe — pure</text>
<text xml:space="preserve" text-anchor="start" x="149.64" y="-128" font-family="Arial" font-size="15.00" fill="#f6ffff">functions</text>
<text xml:space="preserve" text-anchor="start" x="149.64" y="-110" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;backend&#45;logic</text>
<text xml:space="preserve" text-anchor="start" x="149.64" y="-92" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: engineer</text>
</g>
<!-- t_backendb -->
<g id="node4" class="node">
<title>t_backendb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="925.89,-238 556.11,-238 556.11,-58 925.89,-58 925.89,-238"/>
<text xml:space="preserve" text-anchor="start" x="604.23" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="648.17" y="-187" font-family="Arial" font-size="20.00" fill="#ffffff">backend&#45;logic (RECIPE&#45;12)</text>
<text xml:space="preserve" text-anchor="start" x="903.88" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="648.17" y="-164" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="648.17" y="-146" font-family="Arial" font-size="15.00" fill="#f6ffff">searchRecipes — pure filter over</text>
<text xml:space="preserve" text-anchor="start" x="648.17" y="-128" font-family="Arial" font-size="15.00" fill="#f6ffff">the repository port</text>
<text xml:space="preserve" text-anchor="start" x="648.17" y="-110" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;backend&#45;logic</text>
<text xml:space="preserve" text-anchor="start" x="648.17" y="-92" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: engineer</text>
</g>
<!-- enga&#45;&gt;t_backenda -->
<g id="edge1" class="edge">
<title>enga&#45;&gt;t_backenda</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M242,-391.15C242,-347.12 242,-293.76 242,-248.35"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="244.63,-248.42 242,-240.92 239.38,-248.42 244.63,-248.42"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="242,-303 242,-325.8 376.37,-325.8 376.37,-303 242,-303"/>
<text xml:space="preserve" text-anchor="start" x="245" y="-308.8" font-family="Arial" font-size="14.00" fill="#ffffff">works — one commit</text>
</g>
<!-- engb&#45;&gt;t_backendb -->
<g id="edge2" class="edge">
<title>engb&#45;&gt;t_backendb</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M741,-391.15C741,-347.12 741,-293.76 741,-248.35"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="743.63,-248.42 741,-240.92 738.38,-248.42 743.63,-248.42"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="741,-303 741,-325.8 875.37,-325.8 875.37,-303 741,-303"/>
<text xml:space="preserve" text-anchor="start" x="744" y="-308.8" font-family="Arial" font-size="14.00" fill="#ffffff">works — one commit</text>
</g>
</g>
</svg>
`;case`stageUnits`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 16.1.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="995pt" height="680pt"
 viewBox="0.00 0.00 995.00 680.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 665.05)">
<g id="clust1" class="cluster">
<title>cluster_wta</title>
<polygon fill="#0c513c" stroke="#073c28" points="8,-8 8,-642 468,-642 468,-8 8,-8"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-629.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#eeffff" fill-opacity="0.701961">FEATURE+ADD&#45;RECIPE → FEATURE/ADD&#45;RECIPE</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_wtb</title>
<polygon fill="#0c513c" stroke="#073c28" points="497,-8 497,-642 957,-642 957,-8 497,-8"/>
<text xml:space="preserve" text-anchor="start" x="505" y="-629.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#eeffff" fill-opacity="0.701961">FEATURE+SEARCH&#45;RECIPES → FEATURE/SEARCH&#45;RECIPES</text>
</g>
<!-- unita -->
<g id="node1" class="node">
<title>unita</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="417.61,-570.8 58.39,-570.8 58.39,-390.8 417.61,-390.8 417.61,-570.8"/>
<text xml:space="preserve" text-anchor="start" x="106.51" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="150.45" y="-529.6" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;unit</text>
<text xml:space="preserve" text-anchor="start" x="395.6" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="150.45" y="-508.6" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="150.45" y="-487" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the micro tier — one</text>
<text xml:space="preserve" text-anchor="start" x="150.45" y="-469" font-family="Arial" font-size="15.00" fill="#ffffff">back&#45;end function alone; every</text>
<text xml:space="preserve" text-anchor="start" x="150.45" y="-451" font-family="Arial" font-size="15.00" fill="#ffffff">branch, boundary, empty/null,</text>
<text xml:space="preserve" text-anchor="start" x="150.45" y="-433" font-family="Arial" font-size="15.00" fill="#ffffff">error. Never a component (the UI is</text>
<text xml:space="preserve" text-anchor="start" x="150.45" y="-415" font-family="Arial" font-size="15.00" fill="#ffffff">proved by the composition tier).</text>
</g>
<!-- unitb -->
<g id="node2" class="node">
<title>unitb</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="906.61,-570.8 547.39,-570.8 547.39,-390.8 906.61,-390.8 906.61,-570.8"/>
<text xml:space="preserve" text-anchor="start" x="595.51" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="639.45" y="-529.6" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;unit</text>
<text xml:space="preserve" text-anchor="start" x="884.6" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="639.45" y="-508.6" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="639.45" y="-487" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the micro tier — one</text>
<text xml:space="preserve" text-anchor="start" x="639.45" y="-469" font-family="Arial" font-size="15.00" fill="#ffffff">back&#45;end function alone; every</text>
<text xml:space="preserve" text-anchor="start" x="639.45" y="-451" font-family="Arial" font-size="15.00" fill="#ffffff">branch, boundary, empty/null,</text>
<text xml:space="preserve" text-anchor="start" x="639.45" y="-433" font-family="Arial" font-size="15.00" fill="#ffffff">error. Never a component (the UI is</text>
<text xml:space="preserve" text-anchor="start" x="639.45" y="-415" font-family="Arial" font-size="15.00" fill="#ffffff">proved by the composition tier).</text>
</g>
<!-- t_unita -->
<g id="node3" class="node">
<title>t_unita</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="398.02,-238 77.98,-238 77.98,-58 398.02,-58 398.02,-238"/>
<text xml:space="preserve" text-anchor="start" x="127.92" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="171.87" y="-187" font-family="Arial" font-size="20.00" fill="#ffffff">unit&#45;tests (RECIPE&#45;7)</text>
<text xml:space="preserve" text-anchor="start" x="374.19" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="171.87" y="-164" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="171.87" y="-146" font-family="Arial" font-size="15.00" fill="#f6ffff">exhaustive coverage for</text>
<text xml:space="preserve" text-anchor="start" x="171.87" y="-128" font-family="Arial" font-size="15.00" fill="#f6ffff">validateRecipe</text>
<text xml:space="preserve" text-anchor="start" x="171.87" y="-110" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;unit&#45;tests</text>
<text xml:space="preserve" text-anchor="start" x="171.87" y="-92" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;unit (respawn)</text>
</g>
<!-- t_unitb -->
<g id="node4" class="node">
<title>t_unitb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="890.76,-238 563.24,-238 563.24,-58 890.76,-58 890.76,-238"/>
<text xml:space="preserve" text-anchor="start" x="611.36" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="655.31" y="-187" font-family="Arial" font-size="20.00" fill="#ffffff">unit&#45;tests (RECIPE&#45;13)</text>
<text xml:space="preserve" text-anchor="start" x="868.75" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="655.31" y="-164" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="655.31" y="-146" font-family="Arial" font-size="15.00" fill="#f6ffff">exhaustive coverage for</text>
<text xml:space="preserve" text-anchor="start" x="655.31" y="-128" font-family="Arial" font-size="15.00" fill="#f6ffff">searchRecipes</text>
<text xml:space="preserve" text-anchor="start" x="655.31" y="-110" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;unit&#45;tests</text>
<text xml:space="preserve" text-anchor="start" x="655.31" y="-92" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;unit (respawn)</text>
</g>
<!-- unita&#45;&gt;t_unita -->
<g id="edge1" class="edge">
<title>unita&#45;&gt;t_unita</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M238,-391.15C238,-347.12 238,-293.76 238,-248.35"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="240.63,-248.42 238,-240.92 235.38,-248.42 240.63,-248.42"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="238,-303 238,-325.8 371.57,-325.8 371.57,-303 238,-303"/>
<text xml:space="preserve" text-anchor="start" x="241" y="-308.8" font-family="Arial" font-size="14.00" fill="#ffffff">works — test commit</text>
</g>
<!-- unitb&#45;&gt;t_unitb -->
<g id="edge2" class="edge">
<title>unitb&#45;&gt;t_unitb</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M727,-391.15C727,-347.12 727,-293.76 727,-248.35"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="729.63,-248.42 727,-240.92 724.38,-248.42 729.63,-248.42"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="727,-303 727,-325.8 860.57,-325.8 860.57,-303 727,-303"/>
<text xml:space="preserve" text-anchor="start" x="730" y="-308.8" font-family="Arial" font-size="14.00" fill="#ffffff">works — test commit</text>
</g>
</g>
</svg>
`;case`stageFrontends`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 16.1.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="972pt" height="680pt"
 viewBox="0.00 0.00 972.00 680.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 665.05)">
<g id="clust1" class="cluster">
<title>cluster_wta</title>
<polygon fill="#0c513c" stroke="#073c28" points="8,-8 8,-642 462,-642 462,-8 8,-8"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-629.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#eeffff" fill-opacity="0.701961">FEATURE+ADD&#45;RECIPE → FEATURE/ADD&#45;RECIPE</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_wtb</title>
<polygon fill="#0c513c" stroke="#073c28" points="492,-8 492,-642 934,-642 934,-8 492,-8"/>
<text xml:space="preserve" text-anchor="start" x="500" y="-629.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#eeffff" fill-opacity="0.701961">FEATURE+SEARCH&#45;RECIPES → FEATURE/SEARCH&#45;RECIPES</text>
</g>
<!-- fea -->
<g id="node1" class="node">
<title>fea</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="403.78,-570.8 66.22,-570.8 66.22,-390.8 403.78,-390.8 403.78,-570.8"/>
<text xml:space="preserve" text-anchor="start" x="114.34" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="158.28" y="-519.8" font-family="Arial" font-size="20.00" fill="#ffffff">frontend</text>
<text xml:space="preserve" text-anchor="start" x="381.77" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="158.28" y="-496.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the UI worker —</text>
<text xml:space="preserve" text-anchor="start" x="158.28" y="-478.8" font-family="Arial" font-size="15.00" fill="#ffffff">components, layout, styling, the</text>
<text xml:space="preserve" text-anchor="start" x="158.28" y="-460.8" font-family="Arial" font-size="15.00" fill="#ffffff">shared component system. Built</text>
<text xml:space="preserve" text-anchor="start" x="158.28" y="-442.8" font-family="Arial" font-size="15.00" fill="#ffffff">last, against functions already</text>
<text xml:space="preserve" text-anchor="start" x="158.28" y="-424.8" font-family="Arial" font-size="15.00" fill="#ffffff">proved. Label frontend&#45;ui.</text>
</g>
<!-- feb -->
<g id="node2" class="node">
<title>feb</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="881.78,-570.8 544.22,-570.8 544.22,-390.8 881.78,-390.8 881.78,-570.8"/>
<text xml:space="preserve" text-anchor="start" x="592.34" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="636.28" y="-519.8" font-family="Arial" font-size="20.00" fill="#ffffff">frontend</text>
<text xml:space="preserve" text-anchor="start" x="859.77" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="636.28" y="-496.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the UI worker —</text>
<text xml:space="preserve" text-anchor="start" x="636.28" y="-478.8" font-family="Arial" font-size="15.00" fill="#ffffff">components, layout, styling, the</text>
<text xml:space="preserve" text-anchor="start" x="636.28" y="-460.8" font-family="Arial" font-size="15.00" fill="#ffffff">shared component system. Built</text>
<text xml:space="preserve" text-anchor="start" x="636.28" y="-442.8" font-family="Arial" font-size="15.00" fill="#ffffff">last, against functions already</text>
<text xml:space="preserve" text-anchor="start" x="636.28" y="-424.8" font-family="Arial" font-size="15.00" fill="#ffffff">proved. Label frontend&#45;ui.</text>
</g>
<!-- t_fronta -->
<g id="node3" class="node">
<title>t_fronta</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="412.33,-238 57.67,-238 57.67,-58 412.33,-58 412.33,-238"/>
<text xml:space="preserve" text-anchor="start" x="105.79" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="149.74" y="-187" font-family="Arial" font-size="20.00" fill="#ffffff">frontend&#45;ui (RECIPE&#45;8)</text>
<text xml:space="preserve" text-anchor="start" x="390.32" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="149.74" y="-164" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="149.74" y="-146" font-family="Arial" font-size="15.00" fill="#f6ffff">RecipeForm + RecipeCard against</text>
<text xml:space="preserve" text-anchor="start" x="149.74" y="-128" font-family="Arial" font-size="15.00" fill="#f6ffff">proved functions</text>
<text xml:space="preserve" text-anchor="start" x="149.74" y="-110" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;frontend&#45;ui</text>
<text xml:space="preserve" text-anchor="start" x="149.74" y="-92" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: frontend</text>
</g>
<!-- t_frontb -->
<g id="node4" class="node">
<title>t_frontb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="883.99,-238 542.01,-238 542.01,-58 883.99,-58 883.99,-238"/>
<text xml:space="preserve" text-anchor="start" x="590.12" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="634.07" y="-187" font-family="Arial" font-size="20.00" fill="#ffffff">frontend&#45;ui (RECIPE&#45;14)</text>
<text xml:space="preserve" text-anchor="start" x="861.99" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="634.07" y="-164" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="634.07" y="-146" font-family="Arial" font-size="15.00" fill="#f6ffff">SearchBar + live results list</text>
<text xml:space="preserve" text-anchor="start" x="634.07" y="-128" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;frontend&#45;ui</text>
<text xml:space="preserve" text-anchor="start" x="634.07" y="-110" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: frontend</text>
<text xml:space="preserve" text-anchor="start" x="634.07" y="-92" font-family="Arial" font-size="15.00" fill="#f6ffff">category: frontend&#45;ux</text>
</g>
<!-- fea&#45;&gt;t_fronta -->
<g id="edge1" class="edge">
<title>fea&#45;&gt;t_fronta</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M235,-391.15C235,-347.12 235,-293.76 235,-248.35"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="237.63,-248.42 235,-240.92 232.38,-248.42 237.63,-248.42"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="235,-303 235,-325.8 360.01,-325.8 360.01,-303 235,-303"/>
<text xml:space="preserve" text-anchor="start" x="238" y="-308.8" font-family="Arial" font-size="14.00" fill="#ffffff">works — UI commit</text>
</g>
<!-- feb&#45;&gt;t_frontb -->
<g id="edge2" class="edge">
<title>feb&#45;&gt;t_frontb</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M713,-391.15C713,-347.12 713,-293.76 713,-248.35"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="715.63,-248.42 713,-240.92 710.38,-248.42 715.63,-248.42"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="713,-303 713,-325.8 838.01,-325.8 838.01,-303 713,-303"/>
<text xml:space="preserve" text-anchor="start" x="716" y="-308.8" font-family="Arial" font-size="14.00" fill="#ffffff">works — UI commit</text>
</g>
</g>
</svg>
`;case`stageFeatureTier`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 16.1.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1940pt" height="1013pt"
 viewBox="0.00 0.00 1940.00 1013.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 997.85)">
<g id="clust1" class="cluster">
<title>cluster_wta</title>
<polygon fill="#0c513c" stroke="#073c28" points="8,-8 8,-974.8 934,-974.8 934,-8 8,-8"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-961.9" font-family="Arial" font-weight="bold" font-size="11.00" fill="#eeffff" fill-opacity="0.701961">FEATURE+ADD&#45;RECIPE → FEATURE/ADD&#45;RECIPE</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_wtb</title>
<polygon fill="#0c513c" stroke="#073c28" points="964,-8 964,-974.8 1902,-974.8 1902,-8 964,-8"/>
<text xml:space="preserve" text-anchor="start" x="972" y="-961.9" font-family="Arial" font-weight="bold" font-size="11.00" fill="#eeffff" fill-opacity="0.701961">FEATURE+SEARCH&#45;RECIPES → FEATURE/SEARCH&#45;RECIPES</text>
</g>
<!-- fta -->
<g id="node1" class="node">
<title>fta</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="410.06,-903.6 57.94,-903.6 57.94,-723.6 410.06,-723.6 410.06,-903.6"/>
<text xml:space="preserve" text-anchor="start" x="106.06" y="-808" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="150" y="-862.4" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;feature</text>
<text xml:space="preserve" text-anchor="start" x="388.05" y="-808" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="150" y="-841.4" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="150" y="-819.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the composition tier —</text>
<text xml:space="preserve" text-anchor="start" x="150" y="-801.8" font-family="Arial" font-size="15.00" fill="#ffffff">one feature&#39;s pieces proved wired;</text>
<text xml:space="preserve" text-anchor="start" x="150" y="-783.8" font-family="Arial" font-size="15.00" fill="#ffffff">its errors and successes surface.</text>
<text xml:space="preserve" text-anchor="start" x="150" y="-765.8" font-family="Arial" font-size="15.00" fill="#ffffff">Never re&#45;runs the unit tier&#39;s</text>
<text xml:space="preserve" text-anchor="start" x="150" y="-747.8" font-family="Arial" font-size="15.00" fill="#ffffff">edge&#45;case matrix. Label</text>
</g>
<!-- reva -->
<g id="node2" class="node">
<title>reva</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="884.05,-570.8 523.95,-570.8 523.95,-390.8 884.05,-390.8 884.05,-570.8"/>
<text xml:space="preserve" text-anchor="start" x="572.07" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="616.01" y="-519.8" font-family="Arial" font-size="20.00" fill="#ffffff">review</text>
<text xml:space="preserve" text-anchor="start" x="862.04" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="616.01" y="-496.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the reviewer — three</text>
<text xml:space="preserve" text-anchor="start" x="616.01" y="-478.8" font-family="Arial" font-size="15.00" fill="#ffffff">questions from first principles:</text>
<text xml:space="preserve" text-anchor="start" x="616.01" y="-460.8" font-family="Arial" font-size="15.00" fill="#ffffff">does the code do what its source of</text>
<text xml:space="preserve" text-anchor="start" x="616.01" y="-442.8" font-family="Arial" font-size="15.00" fill="#ffffff">truth demands, do the tests prove</text>
<text xml:space="preserve" text-anchor="start" x="616.01" y="-424.8" font-family="Arial" font-size="15.00" fill="#ffffff">it, is it simple and readable. Maps</text>
</g>
<!-- ftb -->
<g id="node3" class="node">
<title>ftb</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="1366.06,-903.6 1013.94,-903.6 1013.94,-723.6 1366.06,-723.6 1366.06,-903.6"/>
<text xml:space="preserve" text-anchor="start" x="1062.06" y="-808" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1106" y="-862.4" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;feature</text>
<text xml:space="preserve" text-anchor="start" x="1344.05" y="-808" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1106" y="-841.4" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="1106" y="-819.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the composition tier —</text>
<text xml:space="preserve" text-anchor="start" x="1106" y="-801.8" font-family="Arial" font-size="15.00" fill="#ffffff">one feature&#39;s pieces proved wired;</text>
<text xml:space="preserve" text-anchor="start" x="1106" y="-783.8" font-family="Arial" font-size="15.00" fill="#ffffff">its errors and successes surface.</text>
<text xml:space="preserve" text-anchor="start" x="1106" y="-765.8" font-family="Arial" font-size="15.00" fill="#ffffff">Never re&#45;runs the unit tier&#39;s</text>
<text xml:space="preserve" text-anchor="start" x="1106" y="-747.8" font-family="Arial" font-size="15.00" fill="#ffffff">edge&#45;case matrix. Label</text>
</g>
<!-- revb -->
<g id="node4" class="node">
<title>revb</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="1852.05,-570.8 1491.95,-570.8 1491.95,-390.8 1852.05,-390.8 1852.05,-570.8"/>
<text xml:space="preserve" text-anchor="start" x="1540.07" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1584.01" y="-519.8" font-family="Arial" font-size="20.00" fill="#ffffff">review</text>
<text xml:space="preserve" text-anchor="start" x="1830.04" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1584.01" y="-496.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the reviewer — three</text>
<text xml:space="preserve" text-anchor="start" x="1584.01" y="-478.8" font-family="Arial" font-size="15.00" fill="#ffffff">questions from first principles:</text>
<text xml:space="preserve" text-anchor="start" x="1584.01" y="-460.8" font-family="Arial" font-size="15.00" fill="#ffffff">does the code do what its source of</text>
<text xml:space="preserve" text-anchor="start" x="1584.01" y="-442.8" font-family="Arial" font-size="15.00" fill="#ffffff">truth demands, do the tests prove</text>
<text xml:space="preserve" text-anchor="start" x="1584.01" y="-424.8" font-family="Arial" font-size="15.00" fill="#ffffff">it, is it simple and readable. Maps</text>
</g>
<!-- t_ftesta -->
<g id="node5" class="node">
<title>t_ftesta</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="394.21,-570.8 57.79,-570.8 57.79,-390.8 394.21,-390.8 394.21,-570.8"/>
<text xml:space="preserve" text-anchor="start" x="105.91" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="149.86" y="-519.8" font-family="Arial" font-size="20.00" fill="#ffffff">feature&#45;test (RECIPE&#45;9)</text>
<text xml:space="preserve" text-anchor="start" x="372.2" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="149.86" y="-496.8" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="149.86" y="-478.8" font-family="Arial" font-size="15.00" fill="#f6ffff">the add&#45;recipe pieces are wired</text>
<text xml:space="preserve" text-anchor="start" x="149.86" y="-460.8" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;feature&#45;test</text>
<text xml:space="preserve" text-anchor="start" x="149.86" y="-442.8" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;feature (respawn)</text>
<text xml:space="preserve" text-anchor="start" x="149.86" y="-424.8" font-family="Arial" font-size="15.00" fill="#f6ffff">category: feature&#45;test</text>
</g>
<!-- t_ftestb -->
<g id="node6" class="node">
<title>t_ftestb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="1361.77,-570.8 1014.23,-570.8 1014.23,-390.8 1361.77,-390.8 1361.77,-570.8"/>
<text xml:space="preserve" text-anchor="start" x="1062.35" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1106.3" y="-519.8" font-family="Arial" font-size="20.00" fill="#ffffff">feature&#45;test (RECIPE&#45;15)</text>
<text xml:space="preserve" text-anchor="start" x="1339.76" y="-475.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1106.3" y="-496.8" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="1106.3" y="-478.8" font-family="Arial" font-size="15.00" fill="#f6ffff">the search pieces are wired</text>
<text xml:space="preserve" text-anchor="start" x="1106.3" y="-460.8" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;feature&#45;test</text>
<text xml:space="preserve" text-anchor="start" x="1106.3" y="-442.8" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;feature (respawn)</text>
<text xml:space="preserve" text-anchor="start" x="1106.3" y="-424.8" font-family="Arial" font-size="15.00" fill="#f6ffff">category: feature&#45;test</text>
</g>
<!-- t_freva -->
<g id="node7" class="node">
<title>t_freva</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="648.55,-238 275.45,-238 275.45,-58 648.55,-58 648.55,-238"/>
<text xml:space="preserve" text-anchor="start" x="323.57" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="367.52" y="-187" font-family="Arial" font-size="20.00" fill="#ffffff">feature&#45;review (RECIPE&#45;10)</text>
<text xml:space="preserve" text-anchor="start" x="626.54" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="367.52" y="-164" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="367.52" y="-146" font-family="Arial" font-size="15.00" fill="#f6ffff">the three questions over</text>
<text xml:space="preserve" text-anchor="start" x="367.52" y="-128" font-family="Arial" font-size="15.00" fill="#f6ffff">feature/add&#45;recipe</text>
<text xml:space="preserve" text-anchor="start" x="367.52" y="-110" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;feature&#45;review</text>
<text xml:space="preserve" text-anchor="start" x="367.52" y="-92" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: review (respawn)</text>
</g>
<!-- t_frevb -->
<g id="node8" class="node">
<title>t_frevb</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="1623.55,-238 1250.45,-238 1250.45,-58 1623.55,-58 1623.55,-238"/>
<text xml:space="preserve" text-anchor="start" x="1298.57" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1342.52" y="-187" font-family="Arial" font-size="20.00" fill="#ffffff">feature&#45;review (RECIPE&#45;16)</text>
<text xml:space="preserve" text-anchor="start" x="1601.54" y="-142.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="1342.52" y="-164" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="1342.52" y="-146" font-family="Arial" font-size="15.00" fill="#f6ffff">the three questions over</text>
<text xml:space="preserve" text-anchor="start" x="1342.52" y="-128" font-family="Arial" font-size="15.00" fill="#f6ffff">feature/search&#45;recipes</text>
<text xml:space="preserve" text-anchor="start" x="1342.52" y="-110" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;feature&#45;review</text>
<text xml:space="preserve" text-anchor="start" x="1342.52" y="-92" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: review (respawn)</text>
</g>
<!-- fta&#45;&gt;t_ftesta -->
<g id="edge1" class="edge">
<title>fta&#45;&gt;t_ftesta</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M231.86,-723.95C230.79,-679.92 229.5,-626.56 228.4,-581.15"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="231.03,-581.15 228.22,-573.72 225.78,-581.28 231.03,-581.15"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="230.24,-635.8 230.24,-658.6 321.82,-658.6 321.82,-635.8 230.24,-635.8"/>
<text xml:space="preserve" text-anchor="start" x="233.24" y="-641.6" font-family="Arial" font-size="14.00" fill="#ffffff">works — suite</text>
</g>
<!-- reva&#45;&gt;t_freva -->
<g id="edge3" class="edge">
<title>reva&#45;&gt;t_freva</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M639.15,-391.15C606.46,-346.47 566.75,-292.19 533.22,-246.35"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="535.36,-244.84 528.82,-240.34 531.13,-247.94 535.36,-244.84"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="590.26,-303 590.26,-325.8 740.17,-325.8 740.17,-303 590.26,-303"/>
<text xml:space="preserve" text-anchor="start" x="593.26" y="-308.8" font-family="Arial" font-size="14.00" fill="#ffffff">works — PR comments</text>
</g>
<!-- ftb&#45;&gt;t_ftestb -->
<g id="edge4" class="edge">
<title>ftb&#45;&gt;t_ftestb</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M1189.46,-723.95C1189.2,-679.92 1188.88,-626.56 1188.6,-581.15"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="1191.23,-581.2 1188.56,-573.72 1185.98,-581.24 1191.23,-581.2"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1189.06,-635.8 1189.06,-658.6 1280.64,-658.6 1280.64,-635.8 1189.06,-635.8"/>
<text xml:space="preserve" text-anchor="start" x="1192.06" y="-641.6" font-family="Arial" font-size="14.00" fill="#ffffff">works — suite</text>
</g>
<!-- revb&#45;&gt;t_frevb -->
<g id="edge6" class="edge">
<title>revb&#45;&gt;t_frevb</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M1609.02,-391.15C1577.28,-346.47 1538.72,-292.19 1506.16,-246.35"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="1508.39,-244.95 1501.9,-240.36 1504.11,-248 1508.39,-244.95"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1561.55,-303 1561.55,-325.8 1711.46,-325.8 1711.46,-303 1561.55,-303"/>
<text xml:space="preserve" text-anchor="start" x="1564.55" y="-308.8" font-family="Arial" font-size="14.00" fill="#ffffff">works — PR comments</text>
</g>
<!-- t_ftesta&#45;&gt;t_freva -->
<g id="edge2" class="edge">
<title>t_ftesta&#45;&gt;t_freva</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M289.24,-391.15C321.12,-346.47 359.85,-292.19 392.55,-246.35"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="394.6,-247.99 396.82,-240.36 390.33,-244.94 394.6,-247.99"/>
</g>
<!-- t_ftestb&#45;&gt;t_frevb -->
<g id="edge5" class="edge">
<title>t_ftestb&#45;&gt;t_frevb</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M1254.73,-391.15C1288.43,-346.38 1329.39,-291.96 1363.94,-246.06"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="1365.85,-247.88 1368.27,-240.31 1361.66,-244.73 1365.85,-247.88"/>
</g>
</g>
</svg>
`;case`stageEpicTier`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 16.1.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1121pt" height="1208pt"
 viewBox="0.00 0.00 1121.00 1208.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1193.45)">
<!-- mergerun -->
<g id="node1" class="node">
<title>mergerun</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="358.85,-1178.4 4.6,-1178.4 4.6,-998.4 358.85,-998.4 358.85,-1178.4"/>
<text xml:space="preserve" text-anchor="start" x="52.72" y="-1082.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="96.66" y="-1127.4" font-family="Arial" font-size="20.00" fill="#ffffff">merge</text>
<text xml:space="preserve" text-anchor="start" x="336.84" y="-1082.8" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="96.66" y="-1104.4" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the epic&#45;tier assembler</text>
<text xml:space="preserve" text-anchor="start" x="96.66" y="-1086.4" font-family="Arial" font-size="15.00" fill="#ffffff">— reads the feature branches off</text>
<text xml:space="preserve" text-anchor="start" x="96.66" y="-1068.4" font-family="Arial" font-size="15.00" fill="#ffffff">the feature gates, assembles them</text>
<text xml:space="preserve" text-anchor="start" x="96.66" y="-1050.4" font-family="Arial" font-size="15.00" fill="#ffffff">onto the epic branch in its own</text>
<text xml:space="preserve" text-anchor="start" x="96.66" y="-1032.4" font-family="Arial" font-size="15.00" fill="#ffffff">worktree, resolves the conflicts</text>
</g>
<!-- e2erun -->
<g id="node2" class="node">
<title>e2erun</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="833.76,-845.6 493.69,-845.6 493.69,-665.6 833.76,-665.6 833.76,-845.6"/>
<text xml:space="preserve" text-anchor="start" x="541.8" y="-750" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="585.75" y="-804.4" font-family="Arial" font-size="20.00" fill="#ffffff">tester&#45;e2e</text>
<text xml:space="preserve" text-anchor="start" x="811.75" y="-750" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="585.75" y="-783.4" font-family="Arial" font-size="13.00" fill="#ffffff">Flask</text>
<text xml:space="preserve" text-anchor="start" x="585.75" y="-761.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the broad tier —</text>
<text xml:space="preserve" text-anchor="start" x="585.75" y="-743.8" font-family="Arial" font-size="15.00" fill="#ffffff">journeys across features on the</text>
<text xml:space="preserve" text-anchor="start" x="585.75" y="-725.8" font-family="Arial" font-size="15.00" fill="#ffffff">real stack; cross&#45;feature state;</text>
<text xml:space="preserve" text-anchor="start" x="585.75" y="-707.8" font-family="Arial" font-size="15.00" fill="#ffffff">one success + one failure per</text>
<text xml:space="preserve" text-anchor="start" x="585.75" y="-689.8" font-family="Arial" font-size="15.00" fill="#ffffff">feature. Label epic&#45;e2e&#45;test, skill</text>
</g>
<!-- epicreviewrun -->
<g id="node3" class="node">
<title>epicreviewrun</title>
<polygon fill="#7c3aed" stroke="#4e0cc3" stroke-width="0" points="1090.78,-512.8 730.67,-512.8 730.67,-332.8 1090.78,-332.8 1090.78,-512.8"/>
<text xml:space="preserve" text-anchor="start" x="778.79" y="-417.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="822.73" y="-461.8" font-family="Arial" font-size="20.00" fill="#ffffff">review</text>
<text xml:space="preserve" text-anchor="start" x="1068.77" y="-417.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="822.73" y="-438.8" font-family="Arial" font-size="15.00" fill="#ffffff">What it is: the reviewer — three</text>
<text xml:space="preserve" text-anchor="start" x="822.73" y="-420.8" font-family="Arial" font-size="15.00" fill="#ffffff">questions from first principles:</text>
<text xml:space="preserve" text-anchor="start" x="822.73" y="-402.8" font-family="Arial" font-size="15.00" fill="#ffffff">does the code do what its source of</text>
<text xml:space="preserve" text-anchor="start" x="822.73" y="-384.8" font-family="Arial" font-size="15.00" fill="#ffffff">truth demands, do the tests prove</text>
<text xml:space="preserve" text-anchor="start" x="822.73" y="-366.8" font-family="Arial" font-size="15.00" fill="#ffffff">it, is it simple and readable. Maps</text>
</g>
<!-- t_merge -->
<g id="node4" class="node">
<title>t_merge</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="363.45,-845.6 0,-845.6 0,-665.6 363.45,-665.6 363.45,-845.6"/>
<text xml:space="preserve" text-anchor="start" x="48.12" y="-750" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-794.6" font-family="Arial" font-size="20.00" fill="#ffffff">epic&#45;merge&#45;pr (RECIPE&#45;2)</text>
<text xml:space="preserve" text-anchor="start" x="341.44" y="-750" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-771.6" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-753.6" font-family="Arial" font-size="15.00" fill="#f6ffff">assemble the feature branches onto</text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-735.6" font-family="Arial" font-size="15.00" fill="#f6ffff">epic/recipe&#45;box</text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-717.6" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;epic&#45;merge&#45;pr</text>
<text xml:space="preserve" text-anchor="start" x="92.06" y="-699.6" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: merge</text>
</g>
<!-- t_e2e -->
<g id="node5" class="node">
<title>t_e2e</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="600.27,-512.8 245.17,-512.8 245.17,-332.8 600.27,-332.8 600.27,-512.8"/>
<text xml:space="preserve" text-anchor="start" x="293.29" y="-417.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="337.24" y="-461.8" font-family="Arial" font-size="20.00" fill="#ffffff">epic&#45;e2e&#45;test (RECIPE&#45;3)</text>
<text xml:space="preserve" text-anchor="start" x="578.26" y="-417.2" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="337.24" y="-438.8" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="337.24" y="-420.8" font-family="Arial" font-size="15.00" fill="#f6ffff">journeys across the whole app in a</text>
<text xml:space="preserve" text-anchor="start" x="337.24" y="-402.8" font-family="Arial" font-size="15.00" fill="#f6ffff">real browser</text>
<text xml:space="preserve" text-anchor="start" x="337.24" y="-384.8" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;epic&#45;e2e&#45;test</text>
<text xml:space="preserve" text-anchor="start" x="337.24" y="-366.8" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: tester&#45;e2e (respawn)</text>
</g>
<!-- t_epicreview -->
<g id="node6" class="node">
<title>t_epicreview</title>
<polygon fill="#64748b" stroke="#415167" stroke-width="0" points="843.44,-180 490,-180 490,0 843.44,0 843.44,-180"/>
<text xml:space="preserve" text-anchor="start" x="538.12" y="-84.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="582.07" y="-129" font-family="Arial" font-size="20.00" fill="#ffffff">epic&#45;review (RECIPE&#45;4)</text>
<text xml:space="preserve" text-anchor="start" x="821.44" y="-84.4" font-family="Arial" font-size="14.00" fill="#ffffff"> </text>
<text xml:space="preserve" text-anchor="start" x="582.07" y="-106" font-family="Arial" font-size="15.00" fill="#f6ffff">What&#39;s inside the ticket:title:</text>
<text xml:space="preserve" text-anchor="start" x="582.07" y="-88" font-family="Arial" font-size="15.00" fill="#f6ffff">the three questions over the whole</text>
<text xml:space="preserve" text-anchor="start" x="582.07" y="-70" font-family="Arial" font-size="15.00" fill="#f6ffff">epic</text>
<text xml:space="preserve" text-anchor="start" x="582.07" y="-52" font-family="Arial" font-size="15.00" fill="#f6ffff">label: &#160;&#160;&#160;epic&#45;review</text>
<text xml:space="preserve" text-anchor="start" x="582.07" y="-34" font-family="Arial" font-size="15.00" fill="#f6ffff">agent: review (respawn)</text>
</g>
<!-- mergerun&#45;&gt;t_merge -->
<g id="edge1" class="edge">
<title>mergerun&#45;&gt;t_merge</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M181.72,-998.75C181.72,-954.72 181.72,-901.36 181.72,-855.95"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="184.35,-856.02 181.72,-848.52 179.1,-856.02 184.35,-856.02"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="181.72,-910.6 181.72,-933.4 303.65,-933.4 303.65,-910.6 181.72,-910.6"/>
<text xml:space="preserve" text-anchor="start" x="184.72" y="-916.4" font-family="Arial" font-size="14.00" fill="#ffffff">works — assemble</text>
</g>
<!-- e2erun&#45;&gt;t_e2e -->
<g id="edge2" class="edge">
<title>e2erun&#45;&gt;t_e2e</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M599.14,-665.95C566.59,-621.27 527.04,-566.99 493.65,-521.15"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="495.81,-519.66 489.27,-515.14 491.56,-522.75 495.81,-519.66"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="550.45,-577.8 550.45,-600.6 665.37,-600.6 665.37,-577.8 550.45,-577.8"/>
<text xml:space="preserve" text-anchor="start" x="553.45" y="-583.6" font-family="Arial" font-size="14.00" fill="#ffffff">works — journeys</text>
</g>
<!-- epicreviewrun&#45;&gt;t_epicreview -->
<g id="edge4" class="edge">
<title>epicreviewrun&#45;&gt;t_epicreview</title>
<path fill="none" stroke="#5d2cb2" stroke-width="2" stroke-dasharray="5,2" d="M845.34,-333.15C812.38,-288.47 772.34,-234.19 738.53,-188.35"/>
<polygon fill="#5d2cb2" stroke="#5d2cb2" stroke-width="2" points="740.65,-186.81 734.09,-182.33 736.43,-189.92 740.65,-186.81"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="796.04,-245 796.04,-267.8 945.96,-267.8 945.96,-245 796.04,-245"/>
<text xml:space="preserve" text-anchor="start" x="799.04" y="-250.8" font-family="Arial" font-size="14.00" fill="#ffffff">works — PR comments</text>
</g>
<!-- t_merge&#45;&gt;t_e2e -->
<g id="edge3" class="edge">
<title>t_merge&#45;&gt;t_e2e</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M246.31,-665.95C278.86,-621.27 318.41,-566.99 351.8,-521.15"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="353.88,-522.75 356.18,-515.14 349.64,-519.66 353.88,-522.75"/>
</g>
<!-- t_e2e&#45;&gt;t_epicreview -->
<g id="edge5" class="edge">
<title>t_e2e&#45;&gt;t_epicreview</title>
<path fill="none" stroke="#505660" stroke-width="2" stroke-dasharray="5,2" d="M488.11,-333.15C521.07,-288.47 561.11,-234.19 594.92,-188.35"/>
<polygon fill="#505660" stroke="#505660" stroke-width="2" points="597.02,-189.92 599.36,-182.33 592.79,-186.81 597.02,-189.92"/>
</g>
</g>
</svg>
`;case`errorMap`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 16.1.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="5782pt" height="558pt"
 viewBox="0.00 0.00 5782.00 558.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 543.05)">
<g id="clust1" class="cluster">
<title>cluster_errors</title>
<polygon fill="#3e4651" stroke="#2d333d" points="8,-8 8,-289.2 5744,-289.2 5744,-8 8,-8"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-276.3" font-family="Arial" font-weight="bold" font-size="11.00" fill="#cbd5e1" fill-opacity="0.701961">THE ALARM VOCABULARY</text>
</g>
<!-- labelambiguous -->
<g id="node1" class="node">
<title>labelambiguous</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="469.75,-228 48.25,-228 48.25,-48 469.75,-48 469.75,-228"/>
<text xml:space="preserve" text-anchor="start" x="96.37" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="140.31" y="-177" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=label&#45;ambiguous</text>
<text xml:space="preserve" text-anchor="start" x="447.74" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="140.31" y="-154" font-family="Arial" font-size="15.00" fill="#fffade">What it is: zero or two dispatching</text>
<text xml:space="preserve" text-anchor="start" x="140.31" y="-136" font-family="Arial" font-size="15.00" fill="#fffade">labels on a claim. The dispatcher</text>
<text xml:space="preserve" text-anchor="start" x="140.31" y="-118" font-family="Arial" font-size="15.00" fill="#fffade">never guesses a specialist — the</text>
<text xml:space="preserve" text-anchor="start" x="140.31" y="-100" font-family="Arial" font-size="15.00" fill="#fffade">ticket is LEFT CLAIMED so its lease</text>
<text xml:space="preserve" text-anchor="start" x="140.31" y="-82" font-family="Arial" font-size="15.00" fill="#fffade">parks it off the frontier, and the</text>
</g>
<!-- metadatamissing -->
<g id="node2" class="node">
<title>metadatamissing</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="1012.29,-228 579.71,-228 579.71,-48 1012.29,-48 1012.29,-228"/>
<text xml:space="preserve" text-anchor="start" x="627.83" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="671.77" y="-177" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=metadata&#45;missing</text>
<text xml:space="preserve" text-anchor="start" x="990.28" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="671.77" y="-154" font-family="Arial" font-size="15.00" fill="#fffade">What it is: no branch in the</text>
<text xml:space="preserve" text-anchor="start" x="671.77" y="-136" font-family="Arial" font-size="15.00" fill="#fffade">claim&#39;s metadata — a plan agent</text>
<text xml:space="preserve" text-anchor="start" x="671.77" y="-118" font-family="Arial" font-size="15.00" fill="#fffade">skipped its one key. Left claimed,</text>
<text xml:space="preserve" text-anchor="start" x="671.77" y="-100" font-family="Arial" font-size="15.00" fill="#fffade">same treatment as a mislabelled</text>
<text xml:space="preserve" text-anchor="start" x="671.77" y="-82" font-family="Arial" font-size="15.00" fill="#fffade">ticket. The loop never invents a</text>
</g>
<!-- branchbusy -->
<g id="node3" class="node">
<title>branchbusy</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="1581.38,-228 1122.62,-228 1122.62,-48 1581.38,-48 1581.38,-228"/>
<text xml:space="preserve" text-anchor="start" x="1170.74" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="1214.69" y="-177" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=branch_busy held=N</text>
<text xml:space="preserve" text-anchor="start" x="1559.37" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="1214.69" y="-154" font-family="Arial" font-size="15.00" fill="#fffade">What it is: tickets exist and are</text>
<text xml:space="preserve" text-anchor="start" x="1214.69" y="-136" font-family="Arial" font-size="15.00" fill="#fffade">claimable, but every branch they</text>
<text xml:space="preserve" text-anchor="start" x="1214.69" y="-118" font-family="Arial" font-size="15.00" fill="#fffade">want is already working. The</text>
<text xml:space="preserve" text-anchor="start" x="1214.69" y="-100" font-family="Arial" font-size="15.00" fill="#fffade">freshly claimed ticket goes</text>
<text xml:space="preserve" text-anchor="start" x="1214.69" y="-82" font-family="Arial" font-size="15.00" fill="#fffade">straight back (bd unclaim) and the</text>
</g>
<!-- worktreefailed -->
<g id="node4" class="node">
<title>worktreefailed</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="2096.95,-228 1691.05,-228 1691.05,-48 2096.95,-48 2096.95,-228"/>
<text xml:space="preserve" text-anchor="start" x="1739.17" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="1783.11" y="-177" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=worktree&#45;failed</text>
<text xml:space="preserve" text-anchor="start" x="2074.94" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="1783.11" y="-154" font-family="Arial" font-size="15.00" fill="#fffade">What it is: git worktree add failed</text>
<text xml:space="preserve" text-anchor="start" x="1783.11" y="-136" font-family="Arial" font-size="15.00" fill="#fffade">under .claude/worktrees/. Left</text>
<text xml:space="preserve" text-anchor="start" x="1783.11" y="-118" font-family="Arial" font-size="15.00" fill="#fffade">claimed — a worker spawned in a</text>
<text xml:space="preserve" text-anchor="start" x="1783.11" y="-100" font-family="Arial" font-size="15.00" fill="#fffade">missing folder burns a slot on</text>
<text xml:space="preserve" text-anchor="start" x="1783.11" y="-82" font-family="Arial" font-size="15.00" fill="#fffade">nothing.</text>
</g>
<!-- workernotdispatched -->
<g id="node5" class="node">
<title>workernotdispatched</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="2679.31,-228 2206.69,-228 2206.69,-48 2679.31,-48 2679.31,-228"/>
<text xml:space="preserve" text-anchor="start" x="2254.81" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="2298.76" y="-168" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=worker&#45;not&#45;dispatched</text>
<text xml:space="preserve" text-anchor="start" x="2657.3" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="2298.76" y="-145" font-family="Arial" font-size="15.00" fill="#fffade">What it is: claude &#45;&#45;bg spawned no</text>
<text xml:space="preserve" text-anchor="start" x="2298.76" y="-127" font-family="Arial" font-size="15.00" fill="#fffade">session. The ticket is put back</text>
<text xml:space="preserve" text-anchor="start" x="2298.76" y="-109" font-family="Arial" font-size="15.00" fill="#fffade">with bd unclaim so the next tick</text>
<text xml:space="preserve" text-anchor="start" x="2298.76" y="-91" font-family="Arial" font-size="15.00" fill="#fffade">can retry it.</text>
</g>
<!-- epicprfailed -->
<g id="node6" class="node">
<title>epicprfailed</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="3251.03,-228 2788.97,-228 2788.97,-48 3251.03,-48 3251.03,-228"/>
<text xml:space="preserve" text-anchor="start" x="2837.09" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="2881.04" y="-177" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=epic&#45;pr&#45;failed step=…</text>
<text xml:space="preserve" text-anchor="start" x="3229.02" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="2881.04" y="-154" font-family="Arial" font-size="15.00" fill="#fffade">What it is: the epic branch or its</text>
<text xml:space="preserve" text-anchor="start" x="2881.04" y="-136" font-family="Arial" font-size="15.00" fill="#fffade">PR could not be published. Steps:</text>
<text xml:space="preserve" text-anchor="start" x="2881.04" y="-118" font-family="Arial" font-size="15.00" fill="#fffade">walk, gate&#45;branch, forge,</text>
<text xml:space="preserve" text-anchor="start" x="2881.04" y="-100" font-family="Arial" font-size="15.00" fill="#fffade">missing&#45;tool, push, pr, annotate.</text>
<text xml:space="preserve" text-anchor="start" x="2881.04" y="-82" font-family="Arial" font-size="15.00" fill="#fffade">Left claimed — a worker spawned</text>
</g>
<!-- frontierempty -->
<g id="node7" class="node">
<title>frontierempty</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="3685.4,-228 3360.6,-228 3360.6,-48 3685.4,-48 3685.4,-228"/>
<text xml:space="preserve" text-anchor="start" x="3408.72" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="3452.67" y="-150" font-family="Arial" font-size="20.00" fill="#fffff3">reason=frontier_empty</text>
<text xml:space="preserve" text-anchor="start" x="3663.39" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="3452.67" y="-127" font-family="Arial" font-size="15.00" fill="#fffade">What it is: the empty frontier&#39;s</text>
<text xml:space="preserve" text-anchor="start" x="3452.67" y="-109" font-family="Arial" font-size="15.00" fill="#fffade">first state — nothing left to do.</text>
</g>
<!-- towerstalled -->
<g id="node8" class="node">
<title>towerstalled</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="4204.37,-228 3795.63,-228 3795.63,-48 4204.37,-48 4204.37,-228"/>
<text xml:space="preserve" text-anchor="start" x="3843.75" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="3887.7" y="-177" font-family="Arial" font-size="20.00" fill="#fffff3">reason=tower_stalled waiting=N</text>
<text xml:space="preserve" text-anchor="start" x="4182.36" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="3887.7" y="-154" font-family="Arial" font-size="15.00" fill="#fffade">What it is: the empty frontier&#39;s</text>
<text xml:space="preserve" text-anchor="start" x="3887.7" y="-136" font-family="Arial" font-size="15.00" fill="#fffade">second state — work exists but sits</text>
<text xml:space="preserve" text-anchor="start" x="3887.7" y="-118" font-family="Arial" font-size="15.00" fill="#fffade">off the frontier behind an open</text>
<text xml:space="preserve" text-anchor="start" x="3887.7" y="-100" font-family="Arial" font-size="15.00" fill="#fffade">blocker, an open gate most often,</text>
<text xml:space="preserve" text-anchor="start" x="3887.7" y="-82" font-family="Arial" font-size="15.00" fill="#fffade">which only a human can clear.</text>
</g>
<!-- maxparallelstalled -->
<g id="node9" class="node">
<title>maxparallelstalled</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="4667.29,-228 4314.71,-228 4314.71,-48 4667.29,-48 4667.29,-228"/>
<text xml:space="preserve" text-anchor="start" x="4362.83" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="4406.78" y="-159" font-family="Arial" font-size="20.00" fill="#fffff3">max_parallel_stalled</text>
<text xml:space="preserve" text-anchor="start" x="4645.28" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="4406.78" y="-136" font-family="Arial" font-size="15.00" fill="#fffade">What it is: at capacity (counted</text>
<text xml:space="preserve" text-anchor="start" x="4406.78" y="-118" font-family="Arial" font-size="15.00" fill="#fffade">fresh each tick from claude agents</text>
<text xml:space="preserve" text-anchor="start" x="4406.78" y="-100" font-family="Arial" font-size="15.00" fill="#fffade">&#45;&#45;json) with nothing in_progress.</text>
</g>
<!-- notdeclareddone -->
<g id="node10" class="node">
<title>notdeclareddone</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="5214.54,-228 4777.46,-228 4777.46,-48 5214.54,-48 5214.54,-228"/>
<text xml:space="preserve" text-anchor="start" x="4825.58" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="4869.53" y="-177" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=not&#45;declared&#45;done</text>
<text xml:space="preserve" text-anchor="start" x="5192.53" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="4869.53" y="-154" font-family="Arial" font-size="15.00" fill="#fffade">What it is: the Stop hook fired but</text>
<text xml:space="preserve" text-anchor="start" x="4869.53" y="-136" font-family="Arial" font-size="15.00" fill="#fffade">$BO_DONE_FILE was never touched.</text>
<text xml:space="preserve" text-anchor="start" x="4869.53" y="-118" font-family="Arial" font-size="15.00" fill="#fffade">Fail&#45;closed: no commit, no push, no</text>
<text xml:space="preserve" text-anchor="start" x="4869.53" y="-100" font-family="Arial" font-size="15.00" fill="#fffade">PR, no close. The ticket stays</text>
<text xml:space="preserve" text-anchor="start" x="4869.53" y="-82" font-family="Arial" font-size="15.00" fill="#fffade">claimed so its lease parks it off</text>
</g>
<!-- noprtarget -->
<g id="node11" class="node">
<title>noprtarget</title>
<polygon fill="#dc2626" stroke="#ad0005" stroke-width="0" points="5703.62,-228 5324.38,-228 5324.38,-48 5703.62,-48 5703.62,-228"/>
<text xml:space="preserve" text-anchor="start" x="5372.5" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="5416.45" y="-168" font-family="Arial" font-size="20.00" fill="#fffff3">ERROR reason=no&#45;pr&#45;target</text>
<text xml:space="preserve" text-anchor="start" x="5681.61" y="-132.4" font-family="Arial" font-size="14.00" fill="#fffff3"> </text>
<text xml:space="preserve" text-anchor="start" x="5416.45" y="-145" font-family="Arial" font-size="15.00" fill="#fffade">What it is: the Stop hook found no</text>
<text xml:space="preserve" text-anchor="start" x="5416.45" y="-127" font-family="Arial" font-size="15.00" fill="#fffade">PR target the loop never handed</text>
<text xml:space="preserve" text-anchor="start" x="5416.45" y="-109" font-family="Arial" font-size="15.00" fill="#fffade">down — named for the target, since</text>
<text xml:space="preserve" text-anchor="start" x="5416.45" y="-91" font-family="Arial" font-size="15.00" fill="#fffade">pr now means the url.</text>
</g>
<!-- dispatcher -->
<g id="node12" class="node">
<title>dispatcher</title>
<polygon fill="#2563eb" stroke="#0042c2" stroke-width="0" points="2641.73,-528 2244.27,-528 2244.27,-348 2641.73,-348 2641.73,-528"/>
<text xml:space="preserve" text-anchor="start" x="2312.33" y="-432.4" font-family="Arial" font-size="14.00" fill="#f1ffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2356.28" y="-477" font-family="Arial" font-size="20.00" fill="#f1ffff">bo loop — the dispatcher</text>
<text xml:space="preserve" text-anchor="start" x="2599.78" y="-432.4" font-family="Arial" font-size="14.00" fill="#f1ffff"> </text>
<text xml:space="preserve" text-anchor="start" x="2356.28" y="-454" font-family="Arial" font-size="15.00" fill="#ddf2ff">What it is: CLI/beads&#45;loop.sh — the</text>
<text xml:space="preserve" text-anchor="start" x="2356.28" y="-436" font-family="Arial" font-size="15.00" fill="#ddf2ff">one command (bo loop) that turns</text>
<text xml:space="preserve" text-anchor="start" x="2356.28" y="-418" font-family="Arial" font-size="15.00" fill="#ddf2ff">beads tickets into background</text>
<text xml:space="preserve" text-anchor="start" x="2356.28" y="-400" font-family="Arial" font-size="15.00" fill="#ddf2ff">workers.Steps it runs, one per</text>
<text xml:space="preserve" text-anchor="start" x="2356.28" y="-382" font-family="Arial" font-size="15.00" fill="#ddf2ff">tick:reads the branches already at</text>
</g>
<!-- hook -->
<g id="node13" class="node">
<title>hook</title>
<polygon fill="#0e7490" stroke="#00516b" stroke-width="0" points="5507.65,-528 5002.35,-528 5002.35,-348 5507.65,-348 5507.65,-528"/>
<text xml:space="preserve" text-anchor="start" x="5070.41" y="-432.4" font-family="Arial" font-size="14.00" fill="#ceffff"> </text>
<text xml:space="preserve" text-anchor="start" x="5114.36" y="-477" font-family="Arial" font-size="20.00" fill="#ceffff">hooks/worker&#45;stop.sh — the Stop hook</text>
<text xml:space="preserve" text-anchor="start" x="5465.7" y="-432.4" font-family="Arial" font-size="14.00" fill="#ceffff"> </text>
<text xml:space="preserve" text-anchor="start" x="5114.36" y="-454" font-family="Arial" font-size="15.00" fill="#b9ffff">What it is: the fail&#45;closed</text>
<text xml:space="preserve" text-anchor="start" x="5114.36" y="-436" font-family="Arial" font-size="15.00" fill="#b9ffff">gatekeeper that fires when a worker</text>
<text xml:space="preserve" text-anchor="start" x="5114.36" y="-418" font-family="Arial" font-size="15.00" fill="#b9ffff">session stops.Steps:checks</text>
<text xml:space="preserve" text-anchor="start" x="5114.36" y="-400" font-family="Arial" font-size="15.00" fill="#b9ffff">$BO_DONE_FILE — no marker, no</text>
<text xml:space="preserve" text-anchor="start" x="5114.36" y="-382" font-family="Arial" font-size="15.00" fill="#b9ffff">commit, no push, no PR, no close</text>
</g>
<!-- dispatcher&#45;&gt;labelambiguous -->
<g id="edge1" class="edge">
<title>dispatcher&#45;&gt;labelambiguous</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M2244.57,-432.6C1821.23,-421.44 842.2,-385.75 525,-289.2 481.84,-276.06 437.99,-255.07 398.68,-232.9"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="400.28,-230.79 392.47,-229.35 397.68,-235.35 400.28,-230.79"/>
</g>
<!-- dispatcher&#45;&gt;metadatamissing -->
<g id="edge2" class="edge">
<title>dispatcher&#45;&gt;metadatamissing</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M2244.49,-425.35C1917.92,-404.56 1282.21,-356.83 1068,-289.2 1024.93,-275.6 980.94,-254.83 941.23,-233.04"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="942.51,-230.74 934.68,-229.4 939.96,-235.33 942.51,-230.74"/>
</g>
<!-- dispatcher&#45;&gt;branchbusy -->
<g id="edge3" class="edge">
<title>dispatcher&#45;&gt;branchbusy</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M2244.66,-417.77C2078.61,-397.65 1837.19,-358.97 1636,-289.2 1593.25,-274.38 1549.08,-253.87 1508.68,-232.76"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="1510.12,-230.55 1502.26,-229.38 1507.67,-235.2 1510.12,-230.55"/>
</g>
<!-- dispatcher&#45;&gt;worktreefailed -->
<g id="edge4" class="edge">
<title>dispatcher&#45;&gt;worktreefailed</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M2264.03,-348.13C2226.79,-329.08 2187.96,-308.78 2152,-289.2 2119.41,-271.45 2084.86,-251.89 2052.01,-232.9"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="2053.67,-230.83 2045.86,-229.34 2051.04,-235.37 2053.67,-230.83"/>
</g>
<!-- dispatcher&#45;&gt;workernotdispatched -->
<g id="edge5" class="edge">
<title>dispatcher&#45;&gt;workernotdispatched</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M2443,-348.4C2443,-313.73 2443,-273.81 2443,-238.19"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="2445.63,-238.3 2443,-230.8 2440.38,-238.3 2445.63,-238.3"/>
</g>
<!-- dispatcher&#45;&gt;epicprfailed -->
<g id="edge6" class="edge">
<title>dispatcher&#45;&gt;epicprfailed</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M2619.01,-348.09C2656.98,-328.77 2696.87,-308.38 2734,-289.2 2769.14,-271.05 2806.63,-251.5 2842.5,-232.7"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="2843.47,-235.15 2848.9,-229.34 2841.04,-230.5 2843.47,-235.15"/>
</g>
<!-- dispatcher&#45;&gt;frontierempty -->
<g id="edge7" class="edge">
<title>dispatcher&#45;&gt;frontierempty</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M2641.61,-427.44C2820.99,-413.18 3089.27,-377.66 3306,-289.2 3340.41,-275.15 3374.81,-254.93 3405.74,-233.85"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="3407.2,-236.03 3411.88,-229.6 3404.21,-231.71 3407.2,-236.03"/>
</g>
<!-- dispatcher&#45;&gt;towerstalled -->
<g id="edge8" class="edge">
<title>dispatcher&#45;&gt;towerstalled</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M2641.65,-424.31C2953.03,-402.75 3541.05,-354.83 3740,-289.2 3781.36,-275.55 3823.42,-254.82 3861.32,-233.07"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="3862.56,-235.38 3867.73,-229.34 3859.92,-230.84 3862.56,-235.38"/>
</g>
<!-- dispatcher&#45;&gt;maxparallelstalled -->
<g id="edge9" class="edge">
<title>dispatcher&#45;&gt;maxparallelstalled</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M2641.68,-433.04C3048.8,-422.93 3964.21,-389.48 4259,-289.2 4297.32,-276.17 4335.57,-255.41 4369.64,-233.45"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="4370.84,-235.8 4375.68,-229.5 4367.97,-231.41 4370.84,-235.8"/>
</g>
<!-- hook&#45;&gt;notdeclareddone -->
<g id="edge10" class="edge">
<title>hook&#45;&gt;notdeclareddone</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M5177.99,-348.4C5147.09,-312.84 5111.38,-271.76 5079.83,-235.45"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="5082.04,-234 5075.14,-230.06 5078.08,-237.44 5082.04,-234"/>
</g>
<!-- hook&#45;&gt;noprtarget -->
<g id="edge11" class="edge">
<title>hook&#45;&gt;noprtarget</title>
<path fill="none" stroke="#a51d1d" stroke-width="2" stroke-dasharray="1,5" d="M5332.01,-348.4C5362.91,-312.84 5398.62,-271.76 5430.17,-235.45"/>
<polygon fill="#a51d1d" stroke="#a51d1d" stroke-width="2" points="5431.92,-237.44 5434.86,-230.06 5427.96,-234 5431.92,-237.44"/>
</g>
</g>
</svg>
`;default:throw Error(`Unknown viewId: `+e)}};export{e as dotSource,t as svgSource};