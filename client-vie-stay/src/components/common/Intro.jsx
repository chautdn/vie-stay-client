import React, { memo } from 'react'
import { text } from '../../utils/dataIntro'
import icons from '../../utils/icons'
import { Button } from '../../components/common'

const { MdOutlineStarPurple500 } = icons;
const star = [1, 2, 3, 4, 5];

const Intro = () => {
  return (
    <div className="w-3/5 bg-white rounded-md shadow-md p-4 gap-4 flex-col flex justify-center items-center">
      <h3 className="font-bold text-lg">{text.title}</h3>
      <p className="text-gray-800 text-center my-4">
        {text.description}
        {text.description2}
      </p>
      <div className="flex items-center justify-around w-full">
        {text.statistic.map((item, index) => {
          return (
            <div
              className="flex flex-col justify-center items-center"
              key={index}
            >
              <h4 className="font-bold text-lg">{item.value}</h4>
              <p className="text-gray-700">{item.name}</p>
            </div>
          );
        })}
      </div>
      <h3 className="font-bold text-lg py-2">{text.price}</h3>
      <div className="flex items-center justify-center gap-1">
        {star.map((item) => {
          return (
            <span key={item}>
              <MdOutlineStarPurple500 size={24} color="yellow" />
            </span>
          );
        })}
      </div>
      <p className="text-gray-600 italic text-center">{text.comment}</p>
      <span className="text-gray-700">{text.author}</span>
      <h3 className="font-bold text-lg py-2">{text.question}</h3>
      <p>{text.answer}</p>
      <Button
        text="Đăng tin ngay"
        bgColor="bg-secondary2"
        textColor="text-white"
        px="px-6"
      />
      <div className="h-12"></div>
    </div>
  );
};

export default memo(Intro);
