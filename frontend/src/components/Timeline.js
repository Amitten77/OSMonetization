import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 500,
    },
  });
  
  const NoMaxWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 'none',
    },
  });


const stages = [
    {
        name: 'Stage 1',
        desc: 'Validating deserving conitrbuitors!'
    },
    {
        name: 'Stage 2',
        desc: 'Make your case on what people deserve! (Round 1)'
    },
    {
        name: 'Stage 3',
        desc: 'Vote on the cases! (Round 1)'
    },
    {
        name: 'Stage 4',
        desc: 'Make your case on what people deserve! (Round 2)'
    },
    {
        name: 'Stage 5',
        desc: 'Vote on the cases! (Round 2)'
    },
    {
        name: 'Stage 6',
        desc: 'Make your case on what people deserve! (Round 3)'
    },
    {
        name: 'Stage 7',
        desc: 'Vote on the cases! (Round 3)'
    },
    {
        name: 'Stage 8',
        desc: 'All done!'
    },
]

export default function BasicTimeline({curr_stage}) {
  return (
    <div className='col-span-1'>
    <Timeline>
      {stages.map((stage, index) => {

        return (
        <Tooltip title={stage.desc} arrow placement="top">
          <div key={index}>
              <TimelineItem key={index}>
                  <TimelineSeparator>
                  <TimelineDot className='dot' color={stage.name == "Stage " + curr_stage ? "success" : "grey"}/>
                  { stage.name != 'Stage 8' ?
                  <TimelineConnector /> :
                  <div></div>
                  }
                  </TimelineSeparator>
                  <TimelineContent>{stage.name}</TimelineContent>
              </TimelineItem>
          </div>
        </Tooltip>
        )
      })}
    </Timeline>
    </div>
  );
}